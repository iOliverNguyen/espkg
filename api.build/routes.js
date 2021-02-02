var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import { downloadAndConvertPackage, readJsonFile } from './bundle.js';
import { responseHeaderOrigin, responseHeadersOk, rootDir } from './config.js';
import { errorContent, sendResponse } from './httpx.js';
import { loadMeta, resolveTag } from "./load.js";
import { parsePath } from './parse.js';
import { ll } from './util/logger.js';
export default function (req, res) {
    return router(req, res).catch((err) => {
        ll.error(`serving ${req.url}: ${errorContent(err)}`);
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(500).send(errorContent(err));
        }
    });
}
export function router(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL('http://localhost' + req.url);
        if (url.pathname === '/__debug@')
            return debug(req, res);
        return serve(req, res);
    });
}
export function debug(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const rr = {
            rootDir: rootDir,
        };
        const pkgJson = yield readJsonFile(`${rootDir}/package.json`);
        rr.package = pkgJson;
        console.log('package json', JSON.stringify(pkgJson));
        let dirs = fs.readdirSync(`${rootDir}`);
        for (let dir of dirs) {
            rr.root = dirs;
        }
        const dirpath = req.query['dirpath'];
        if (dirpath) {
            dirs = fs.readdirSync(path.resolve(rootDir, dirpath));
            for (let dir of dirs) {
                console.log('dir:', dir);
            }
            rr.lib = dirs;
        }
        res.status(400).json(rr);
        return;
    });
}
export function serve(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        sendHeaders(res, responseHeaderOrigin);
        const { method, url } = req;
        if (method !== 'GET') {
            res.status(400).json({ msg: 'not found' });
            return;
        }
        const pp = parsePath(url);
        if (!pp) {
            res.status(400).json({ msg: `malform url` });
            return;
        }
        let { fullname, tag, filepath } = pp;
        if (!tag)
            tag = 'latest';
        const meta = yield loadMeta(fullname);
        ll.info(`package: ${fullname}`);
        let respData = resolveTag(meta, fullname, tag, filepath);
        if (respData) {
            return sendResponse(res, respData);
        }
        const data = yield downloadAndConvertPackage(meta, fullname, tag, filepath);
        sendHeaders(res, responseHeadersOk);
        res.status(200).write(data.compiledData);
        res.end();
        ll.info(`package: ${fullname} served`);
    });
}
function sendHeaders(res, headers) {
    for (let [header, value] of Object.entries(headers)) {
        res.setHeader(header, value);
    }
}
//# sourceMappingURL=routes.js.map