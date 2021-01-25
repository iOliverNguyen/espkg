import type {NowRequest, NowResponse} from '@vercel/node'

import {URL} from 'url'
import {ll} from './util/logger'
import * as semver from 'semver'
import fetch from "node-fetch"
import * as fs from 'fs'

const registry = 'https://registry.npmjs.org'

/**
 npm package naming, let's use the simplest rules:
 - max 214 chars
 - only dots, dashes, and underscores (. - _)
 - distinct between uppercase and lowercase, both are different packages:
 https://www.npmjs.com/package/JSONStream
 https://www.npmjs.com/package/jsonstream

 References:
 - username         https://docs.npmjs.com/creating-a-new-npm-user-account
 - package name     https://github.com/npm/validate-npm-package-name
 - semantic version https://devhints.io/semver
 */
//                 12...................2..1.3.....................34.5..........................54.6......6
const rePath = /^\/((@[A-Za-z0-9-]{1,64})\/)?([A-Za-z0-9._-]{1,214})(@([a-zA-Z<=>^~0-9*.+-]{1,32}))?(\/[^?#]+)?/

export default function (req: NowRequest, res: NowResponse) {
  exec(req, res)
    .then(({code, body}) => {
      res.status(code)
      body && res.json(body)
    })
    .catch((err) => {
      ll.error(`-> ${req.url}: ${errorContent(err)}`)
      if (!res.headersSent) {
        res.status(500).json({
          err: errorContent(err),
          msg: 'something went wrong!'
        })
      }
    })
}

async function exec(req: NowRequest, res: NowResponse): Promise<Response> {
  console.log('req', req)
  const {method, url} = req
  if (method !== 'GET') {
    return response(404, {code: 'not found'})
  }

  const pp = parsePath(url as string)
  if (!pp) {
    return response(404, {code: 'malform url'})
  }
  const {namespace, name, qualifier, tag, filepath} = pp

  // try starting new process

  // find package

  // parse semver

  // transform

  // retrieve file

  res.setHeader('w-parsed', JSON.stringify({namespace, name, tag, filepath}))
  fs.writeFileSync('/tmp/a.txt', 'sample')
  const _content = fs.readFileSync('/tmp/a.txt').toString()

  res.setHeader('w-content', _content)
  return response(200, {msg: 'ok'})
}

type UrlParsed = {
  namespace: string
  name: string
  qualifier: string
  tag: string
  filepath: string
  url: URL
}

// url must start with /
export function parsePath(input: string): UrlParsed | void {
  if (input[0] !== '/') throw new Error(`unexpected url format: ${input}`)

  const parsedUrl = new URL('http://localhost' + input)
  const urlPath = parsedUrl.pathname

  const parts = rePath.exec(urlPath)
  if (!parts) return

  const [, , namespace, name, , tag, filepath] = parts
  const remain = urlPath.slice(parts[0].length)
  if (remain) return

  const qualifier = namespace ? namespace + '/' + name : name
  return {namespace, name, qualifier, tag, filepath, url: parsedUrl}
}

type Response = {
  code: number
  redirect?: string
  body?: any
}

async function download(qualifier: string, tag: string, filepath): Promise<Response> {
  const metaUrl = `${registry}/${encodeURIComponent(qualifier).replace('%40', '@')}`
  const respBody = await get(metaUrl)
  const meta = JSON.parse(respBody)

  if (!meta.versions) {
    ll.error(`[${qualifier}] invalid module`);
    return response(400, 'invalid module');
  }

  const version = findVersion(meta, tag);

  if (!semver.valid(version)) {
    ll.error(`[${qualifier}] invalid tag`);
    return response(400, 'invalid tag');
  }

  if (version !== tag) {
    let url = `/${meta.name}@${version}`;
    if (filepath) url += `/${filepath}`;

    return redirect(302, url)
  }

  return {
    code: 200,
    body: {msg: 'working...'}
  }

  // return fetchBundle(meta, tag, filepath, query).then(zipped => {
  //   ll.info(`[${qualifier}] serving ${zipped.length} bytes`);
  //   res.status(200);
  //   res.set(
  //     Object.assign(
  //       {
  //         'Content-Length': zipped.length,
  //         'Content-Type': 'application/javascript; charset=utf-8',
  //         'Content-Encoding': 'gzip'
  //       },
  //       additionalBundleResHeaders
  //     )
  //   );
  //
  //   // FIXME(sven): calculate the etag based on the original content
  //   res.setHeader('ETag', etag(zipped));
  //   res.end(zipped);
  // });
}

function response(code: number, body: any): Response {
  return {code, body}
}

function redirect(code: number, url: string): Response {
  return {code, redirect: url}
}

function responseError(code: number, err: any, msg?: string, meta?: object): Response {
  return {
    code,
    body: Object.assign({
      error: errorContent(err),
      msg,
    }, meta)
  }
}

function errorContent(err: any): string {
  return err.stack || err.message || `${err}`
}

function stringify(query) {
  const str = Object.keys(query)
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('&');
  return str ? `?${str}` : '';
}

function findVersion(meta, tag: string) {
  // a valid version?
  if (semver.valid(tag)) return meta.versions[tag] && tag;

  // dist tag
  if (tag in meta['dist-tags']) return meta['dist-tags'][tag];

  // semver range
  return semver.maxSatisfying(Object.keys(meta.versions), tag);
}

export async function get(url: string): Promise<any> {
  const resp = await fetch(url)
  return await resp.json()
}
