import type {NowRequest, NowResponse} from '@vercel/node';
import fs from 'fs';
import {downloadAndConvertPackage, readJsonFile} from './bundle.js';
import {responseHeadersOk, rootDir} from './config.js';
import {errorContent, ResponseData, sendResponse} from './httpx.js';
import {loadMeta, resolveTag} from "./load.js";
import {parsePath} from './parse.js';
import {ll} from './util/logger.js';

export default function (req: NowRequest, res: NowResponse) {
  ll.debug("--");
  return router(req, res).catch((err) => {
    ll.error(`serving ${req.url}: ${errorContent(err)}`);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send(errorContent(err));
    }
  });
}

export async function router(req: NowRequest, res: NowResponse) {
  const url = req.url;
  if (url === '/__debug@') return debug(req, res);
  return serve(req, res);
}

export async function debug(req: NowRequest, res: NowResponse) {
  const rr: any = {
    rootDir: rootDir,
  };

  const pkgJson = await readJsonFile(`${rootDir}/package.json`);
  rr.package = pkgJson;
  console.log('package json', JSON.stringify(pkgJson));

  let dirs = fs.readdirSync(`${rootDir}`);
  for (let dir of dirs) {
    console.log('root:', dir);
  }

  dirs = fs.readdirSync(`${rootDir}/build.api`);
  for (let dir of dirs) {
    console.log('dir:', dir);
  }
  rr.lib = dirs;

  // dirs = fs.readdirSync(`${rootDir}/deps/y.js`);
  // for (let dir of dirs) {
  //   console.log('dir:', dir);
  // }
  // rr.dirs = dirs;

  // const stat = fs.statSync(`${rootDir}/node_modules/yarn`);
  // console.log('isFile', stat.isFile());
  // console.log('isDirectory', stat.isDirectory());
  // console.log('isBlockDevice', stat.isBlockDevice());
  // console.log('isCharacterDevice', stat.isCharacterDevice());
  // console.log('isSymbolicLink', stat.isSymbolicLink());
  // console.log('isFIFO', stat.isFIFO());
  // console.log('isSocket', stat.isSocket());

  // let yarnDirs = fs.readdirSync(`${rootDir}/node_modules/yarn`)
  // for (let dir of yarnDirs) {
  //   console.log('yarn dir:', dir);
  // }
  //
  // let yarnBinDirs = fs.readdirSync(`${rootDir}/node_modules/yarn/bin`);
  // for (let dir of yarnBinDirs) {
  //   console.log('yarn bin dir:', dir);
  // }

  // rr.yarn = fs.readFileSync(`${rootDir}/node_modules/yarn/bin/yarn.js`).toString();

  res.status(400).json(rr);
  return;
}

export async function serve(req: NowRequest, res: NowResponse) {
  const {method, url} = req;
  if (method !== 'GET') {
    res.status(400).json({msg: 'not found'});
    return;
  }
  const pp = parsePath(url);
  if (!pp) {
    res.status(400).json({msg: `malform url`});
    return;
  }
  let {fullname, tag, filepath} = pp;
  if (!tag) tag = 'latest';

  const meta = await loadMeta(fullname);
  ll.info(`package: ${fullname}`);

  let respData = resolveTag(meta, fullname, tag, filepath);
  if (respData) return sendResponse(res, respData as ResponseData);

  const data = await downloadAndConvertPackage(meta, fullname, tag, filepath);

  for (let [header, value] of Object.entries(responseHeadersOk)) {
    res.setHeader(header, value);
  }
  res.status(200).write(data.compiledData);
  res.end();
  ll.info(`package: ${fullname} served`);
}
