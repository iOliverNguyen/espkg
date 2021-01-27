var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exec as _exec } from 'child_process';
import * as esinstall from 'esinstall';
import fs from 'fs/promises';
import mkdirp from 'mkdirp';
import path from 'path';
import _rimraf from 'rimraf';
import { promisify } from 'util';
import { npmInstallEnvVars, rootDir, tmpDir } from './config.js';
import { ll } from './util/logger.js';
const exec = promisify(_exec);
const rimraf = promisify(_rimraf);
export function downloadAndConvertPackage(meta, fullname, tag, filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisMeta = meta.versions[tag];
        const dist = thisMeta.dist;
        const tarUrl = dist.tarball;
        if (!tarUrl) {
            throw new Error('can not download package');
        }
        // extract tar ball
        const outterDir = `${tmpDir}/${fullname}-${tag}-${dist.shasum}`;
        // TODO: do we need to download package?
        //
        // const extractDir = await execWithTimeout(downloadTimeout,
        //   fetchAndExtractBundle(fullname, tarUrl, outterDir));
        //
        // const packageDir = `${outterDir}/node_modules/${fullname}`;
        // await mkdirp(path.dirname(packageDir));
        // await fs.rename(extractDir, packageDir);
        // ll.debug(`extracted to ${packageDir}`);
        //
        // await sanitizePkg(packageDir);
        ll.debug(`working in ${outterDir}`);
        try {
            rimraf(outterDir);
        }
        catch (e) {
        }
        yield mkdirp(outterDir);
        // create package.json
        const mockPackageJson = {
            name: 'mock',
            description: 'sample description',
            version: '0.0.1',
            private: true,
            dependencies: {},
        };
        Object.assign(mockPackageJson.dependencies, thisMeta.peerDependencies);
        mockPackageJson.dependencies[fullname] = tag;
        yield fs.writeFile(`${outterDir}/package.json`, JSON.stringify(mockPackageJson, null, '  '));
        // install dependencies
        ll.debug(`installing dependencies...`);
        yield installDependencies(outterDir);
        ll.debug(`installed dependencies`);
        // run esinstall
        yield esinstall.install([fullname], {
            cwd: outterDir,
            polyfillNode: true,
        });
        const webmodulePath = `${outterDir}/web_modules`;
        const importMapPath = `${outterDir}/web_modules/import-map.json`;
        const importMap = yield readJsonFile(importMapPath);
        const compiledFilePath = path.resolve(webmodulePath, importMap.imports[fullname]);
        const compiledData = (yield fs.readFile(compiledFilePath)).toString();
        return {
            compiledData,
        };
    });
}
function readJsonFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs.readFile(path);
        return JSON.parse(data.toString());
    });
}
function sanitizePkg(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkg = yield readJsonFile(`${cwd}/package.json`);
        pkg.scripts = {};
        return fs.writeFile(`${cwd}/package.json`, JSON.stringify(pkg, null, '  '));
    });
}
function installDependencies(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const envVariables = npmInstallEnvVars.join(' ');
        const installCommand = `${envVariables} ${rootDir}/node_modules/.bin/yarn install`;
        const execRes = yield exec(installCommand, { cwd });
        if (execRes.stdout)
            ll.debug(execRes.stdout);
        if (execRes.stderr)
            ll.error(execRes.stderr);
    });
}
function stringify(query) {
    var str = Object.keys(query)
        .sort()
        .map(function (key) {
        return key + "=" + query[key];
    })
        .join('&');
    return str ? "?" + str : '';
}
//# sourceMappingURL=bundle.js.map