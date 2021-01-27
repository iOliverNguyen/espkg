var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
export class ResponseData {
    constructor(value) {
        Object.assign(this, value);
    }
}
export function isResponse(input) {
    return input instanceof ResponseData;
}
export function sendResponse(res, resData) {
    if (resData.redirect)
        return res.redirect(resData.code, resData.redirect);
    res.status(resData.code);
    if (resData.body)
        return res.json(resData.body);
}
export function fetchJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(url);
        return yield resp.json();
    });
}
export function response(code, body) {
    return new ResponseData({ code, body });
}
export function redirect(code, url) {
    return new ResponseData({ code: code, redirect: url });
}
export function responseError(code, err, msg, extra) {
    return new ResponseData({
        code: code,
        body: Object.assign({ error: errorContent(err), msg: msg }, extra),
    });
}
export function errorContent(err) {
    return err.stack || err.message || `${err}`;
}
//# sourceMappingURL=httpx.js.map