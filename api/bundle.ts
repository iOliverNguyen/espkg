import * as child_process from 'child_process';
import * as esinstall from 'esinstall';
import fs from 'fs/promises';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';
import * as util from 'util';
import {npmInstallEnvVars, rootDir, tmpDir} from './config.js';
import type {ResponseData} from './httpx.js';
import type {ConvertedPackage, ImportMap, RegistryPackageMeta} from './types.js';
import {ll} from './util/logger.js';

const exec = util.promisify(child_process.exec);

export async function downloadAndConvertPackage(meta: RegistryPackageMeta, fullname: string, tag: string, filepath: string): Promise<ResponseData | ConvertedPackage> {
  const thisMeta = meta.versions[tag];
  const dist = thisMeta.dist;
  // const tarUrl = dist.tarball;
  // if (!tarUrl) {
  //   return responseError(412, new Error('can not download package'));
  // }

  // extract tar ball
  const outterDir = `${tmpDir}/${fullname}-${tag}-${dist.shasum}`;

  // TODO: do we need to download package?
  //
  // const extractDir = await execWithTimeout(downloadTimeout,
  //   fetchAndExtractBundle(fullname, tarUrl, outterDir));
  //
  // const packageDir = `${outterDir}/node_modules/${fullname}`;
  // await mkdirp(path.dirname(packageDir));
  // await fs.rename(extractDir, packageDir);
  // ll.debug(`extracted to ${packageDir}`);
  //
  // await sanitizePkg(packageDir);

  ll.debug(`working in ${outterDir}`);
  try {
    rimraf(outterDir);
  } catch (e) {
  }
  await mkdirp(outterDir);

  // create package.json
  const mockPackageJson = {
    name: 'mock',
    description: 'sample description',
    version: '0.0.1',
    private: true,
    dependencies: {},
  };
  Object.assign(mockPackageJson.dependencies, thisMeta.peerDependencies);
  mockPackageJson.dependencies[fullname] = tag;

  await fs.writeFile(`${outterDir}/package.json`, JSON.stringify(mockPackageJson, null, '  '));

  // install dependencies
  ll.debug(`installing dependencies...`);
  await installDependencies(outterDir);

  ll.debug(`installed dependencies`);

  // run esinstall
  await esinstall.install([fullname], {
    cwd: outterDir,
    polyfillNode: true,
  });

  const webmodulePath = `${outterDir}/web_modules`;
  const importMapPath = `${outterDir}/web_modules/import-map.json`;
  const importMap = await readJsonFile(importMapPath) as ImportMap;
  const compiledFilePath = path.resolve(webmodulePath, importMap.imports[fullname]);
  const compiledData = (await fs.readFile(compiledFilePath)).toString();

  return {
    compiledData,
  };
}

async function readJsonFile(path: string) {
  const data = await fs.readFile(path);
  return JSON.parse(data.toString());
}

async function sanitizePkg(cwd: string) {
  const pkg = await readJsonFile(`${cwd}/package.json`);
  pkg.scripts = {};
  return fs.writeFile(
    `${cwd}/package.json`,
    JSON.stringify(pkg, null, '  '),
  );
}


async function installDependencies(cwd: string) {
  const envVariables = npmInstallEnvVars.join(' ');
  const installCommand = `${envVariables} ${rootDir}/node_modules/.bin/yarn install`;

  const execRes = await exec(installCommand, {cwd});
  if (execRes.stdout) ll.debug(execRes.stdout);
  if (execRes.stderr) ll.error(execRes.stderr);
}


function stringify(query) {
  var str = Object.keys(query)
    .sort()
    .map(function (key) {
      return key + "=" + query[key];
    })
    .join('&');
  return str ? "?" + str : '';
}
