import type {NowRequest, NowResponse} from '@vercel/node';
import {downloadAndConvertPackage} from './bundle.js';
import {errorContent, sendResponse} from './httpx.js';
import {loadMeta, resolveTag} from "./load.js";
import {parsePath} from './parse.js';
import {ll} from './util/logger.js';

export default function (req: NowRequest, res: NowResponse) {
  return routes(req, res).catch((err) => {
    ll.error(`serving ${req.url}: ${errorContent(err)}`);
    if (!res.headersSent) {
      res.status(500).send(errorContent(err));
    }
  });
}

export async function routes(req: NowRequest, res: NowResponse) {
  const {method, url} = req;
  if (method !== 'GET') {
    res.status(404).json({code: 'not found'});
    return;
  }
  const pp = parsePath(url);
  if (!pp) {
    res.status(200).send(`malform url`);
    return;
  }
  let {fullname, tag, filepath} = pp;
  if (!tag) tag = 'latest';

  const meta = await loadMeta(fullname);
  ll.info(`package: ${fullname}`);

  let respData = resolveTag(meta, fullname, tag, filepath);
  if (respData) return sendResponse(res, respData);

  const data = await downloadAndConvertPackage(meta, fullname, tag, filepath);
  res.status(200).write(data.compiledData);
  res.end();
  ll.info(`package: ${fullname} served`)
}
