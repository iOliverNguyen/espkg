import fs from 'fs';
import mkdirp from 'mkdirp';
import fetch from 'node-fetch';
import semver from 'semver/preload.js';
import {pipeline as _pipeline} from 'stream';
import * as tar from 'tar';
import {promisify} from 'util';
import {fetchJson, redirect, response, ResponseData} from './httpx.js';
import {findVersion} from './parse.js';
import type {RegistryPackageMeta} from "./types.js";
import {ll} from './util/logger.js';

const registry = 'https://registry.npmjs.org';
const pipeline = promisify(_pipeline);

export async function loadMeta(fullname: string): Promise<RegistryPackageMeta> {

  const metaUrl = `${registry}/${encodeURIComponent(fullname).replace('%40', '@')}`;

  return await fetchJson(metaUrl) as RegistryPackageMeta;
}

export function resolveTag(meta: RegistryPackageMeta, fullname: string, tag: string, filepath: string): ResponseData | void {
  if (meta.name !== fullname || !meta.versions) {
    ll.error(`invalid module: ${fullname}`);
    return response(400, 'invalid module');
  }

  const version = findVersion(meta, tag);
  if (!semver.valid(version)) {
    ll.error(`invalid tag: ${fullname}`);
    return response(400, 'invalid tag');
  }

  if (version !== tag) {
    let url = `/${meta.name}@${version}`;
    if (filepath) url += `/${filepath}`;

    return redirect(302, url);
  }
}

// npm modules always extract with 'package' directory
export async function fetchAndExtractBundle(fullname: string, tarUrl: string, dir: string): Promise<string> {
  await mkdirp(dir);
  const resp = await fetch(tarUrl);
  if (!resp.ok) throw new Error(`unexpected response ${resp.statusText}`);

  const outFile = `${dir}/package.tgz`;
  await pipeline(resp.body, fs.createWriteStream(outFile));
  await tar.extract({file: outFile, cwd: dir});

  ll.debug('extracted', fullname, outFile, dir);
  return dir + '/package';
}

export function execWithTimeout(timeout, ...promises) {
  let timeoutId;
  const countDown = new Promise((_, reject) => {
    timeoutId = setTimeout(reject, timeout, new Error('timed out'));
  });
  return Promise.race([countDown, ...promises])
    .then((result) => {
      clearTimeout(timeoutId);
      return result;
    });
}
