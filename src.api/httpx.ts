import type {NowResponse} from '@vercel/node';
import fetch from 'node-fetch';

export class ResponseData {
  code: number;
  redirect?: string;
  body?: any;

  constructor(value: any) {
    Object.assign(this, value);
  }
}

export function isResponse(input: any): input is ResponseData {
  return input instanceof ResponseData;
}

export function sendResponse(res: NowResponse, resData: ResponseData): NowResponse {
  if (resData.redirect) return res.redirect(resData.code, resData.redirect);

  res.status(resData.code);
  if (resData.body) return res.json(resData.body);
}

export async function fetchJson(url: string): Promise<any> {
  const resp = await fetch(url);
  return await resp.json();
}

export function response(code: number, body: any): ResponseData {
  return new ResponseData({code, body});
}

export function redirect(code: number, url: string) {
  return new ResponseData({code: code, redirect: url});
}

export function responseError(code: number, err: any, msg?: string, extra?: any) {
  return new ResponseData({
    code: code,
    body: {
      error: errorContent(err),
      msg: msg,
      ...extra,
    },
  });
}

export function errorContent(err) {
  return err.stack || err.message || `${err}`;
}
