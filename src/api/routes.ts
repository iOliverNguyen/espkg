import type {NowRequest, NowResponse} from '@vercel/node';
import {downloadAndConvertPackage} from './bundle.js';
import {sendResponse} from './httpx.js';
import {loadMeta, resolveTag} from "./load.js";
import {parsePath} from './parse.js';
import {ll} from './util/logger.js';

export default async function (req: NowRequest, res: NowResponse) {
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

  const data = await downloadAndConvertPackage(meta, fullname, tag, filepath);
  res.status(200).write(data);
  res.end()
}
