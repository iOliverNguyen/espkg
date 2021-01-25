import type {NowRequest, NowResponse} from '@vercel/node'

import {URL} from 'url'

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
  console.log('req', req)
  const {method, url} = req
  if (method !== 'GET') {
    res.status(404).json({code: 'not found'})
    return
  }

  const pp = parsePath(url as string)
  if (!pp) {
    res.status(200).send(`malform url`)
    return
  }
  const {namespace, name, semver, filepath} = pp

  // try starting new project

  // find package

  // parse semver

  // transform

  // retrieve file

  res.status(200).json({
    namespace,
    name,
    semver,
    filepath
  })
}

type UrlParsed = {
  namespace: string
  name: string
  semver: string
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

  const [, , namespace, name, , semver, filepath] = parts
  const remain = urlPath.slice(parts[0].length)
  if (remain) return

  return {namespace, name, semver, filepath, url: parsedUrl}
}
