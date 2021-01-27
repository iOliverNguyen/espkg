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
import { downloadAndConvertPackage, readJsonFile } from './bundle.js';
import { responseHeadersOk, rootDir } from './config.js';
import { errorContent, sendResponse } from './httpx.js';
import { loadMeta, resolveTag } from "./load.js";
import { parsePath } from './parse.js';
import { ll } from './util/logger.js';
export default function (req, res) {
    ll.debug("--");
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
        const url = req.url;
        if (url === '/__debug@')
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
        const dirs = fs.readdirSync(`${rootDir}/node_modules`);
        for (let dir of dirs) {
            console.log('dir:', dir);
        }
        rr.dirs = dirs;
        const stat = fs.statSync(`${rootDir}/node_modules/yarn`);
        console.log('isFile', stat.isFile());
        console.log('isDirectory', stat.isDirectory());
        console.log('isBlockDevice', stat.isBlockDevice());
        console.log('isCharacterDevice', stat.isCharacterDevice());
        console.log('isSymbolicLink', stat.isSymbolicLink());
        console.log('isFIFO', stat.isFIFO());
        console.log('isSocket', stat.isSocket());
        // let yarnDirs = fs.readdirSync(`${rootDir}/node_modules/yarn`)
        // for (let dir of yarnDirs) {
        //   console.log('yarn dir:', dir);
        // }
        //
        // let yarnBinDirs = fs.readdirSync(`${rootDir}/node_modules/yarn/bin`);
        // for (let dir of yarnBinDirs) {
        //   console.log('yarn bin dir:', dir);
        // }
        // rr.yarn = fs.readFileSync(`${rootDir}/node_modules/yarn/bin/yarn.js`).toString();
        res.status(400).json(rr);
        return;
    });
}
export function serve(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (respData)
            return sendResponse(res, respData);
        const data = yield downloadAndConvertPackage(meta, fullname, tag, filepath);
        for (let [header, value] of Object.entries(responseHeadersOk)) {
            res.setHeader(header, value);
        }
        res.status(200).write(data.compiledData);
        res.end();
        ll.info(`package: ${fullname} served`);
    });
}
//# sourceMappingURL=routes.js.map