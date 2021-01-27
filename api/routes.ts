import fs from 'fs/promises';
import mkdirp from 'mkdirp';
import {downloadAndConvertPackage} from './bundle.js';
import {downloadTimeout, tmpDir} from './config.js';
import {sendResponse} from './httpx.js';
import {execWithTimeout, fetchAndExtractBundle, loadMeta, resolveTag} from "./load.js";
import {parsePath} from './parse.js';
import {ll} from './util/logger.js';
import path from 'path'

export default async function (req, res) {
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
  const {namespace, shortname, fullname, tag, filepath} = pp;

  const meta = await loadMeta(fullname);
  ll.info(`package: ${meta.name}`);

  let respData = resolveTag(meta, fullname, tag, filepath);
  if (respData) return sendResponse(res, respData);

  await downloadAndConvertPackage(meta, fullname, tag, filepath)

  res.status(200).json({
    namespace,
    name: shortname,
    tag,
    filepath,
  });
}
