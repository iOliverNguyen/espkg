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
import mkdirp from 'mkdirp';
import fetch from 'node-fetch';
import semver from 'semver/preload.js';
import { pipeline as _pipeline } from 'stream';
import * as tar from 'tar';
import { promisify } from 'util';
import { fetchJson, redirect, response } from './httpx.js';
import { findVersion } from './parse.js';
import { ll } from './util/logger.js';
const registry = 'https://registry.npmjs.org';
const pipeline = promisify(_pipeline);
export function loadMeta(fullname) {
    return __awaiter(this, void 0, void 0, function* () {
        const metaUrl = `${registry}/${encodeURIComponent(fullname).replace('%40', '@')}`;
        return yield fetchJson(metaUrl);
    });
}
export function resolveTag(meta, fullname, tag, filepath) {
    if (!meta.versions) {
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
        if (filepath)
            url += `/${filepath}`;
        return redirect(302, url);
    }
}
// npm modules always extract with 'package' directory
export function fetchAndExtractBundle(fullname, tarUrl, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mkdirp(dir);
        const resp = yield fetch(tarUrl);
        if (!resp.ok)
            throw new Error(`unexpected response ${resp.statusText}`);
        const outFile = `${dir}/package.tgz`;
        yield pipeline(resp.body, fs.createWriteStream(outFile));
        yield tar.extract({ file: outFile, cwd: dir });
        ll.debug('extracted', fullname, outFile, dir);
        return dir + '/package';
    });
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
//# sourceMappingURL=load.js.map