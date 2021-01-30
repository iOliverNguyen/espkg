import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';
import { fileURLToPath } from 'url';
export const downloadTimeout = 3000;
export const enableDebug = true;
export const npmInstallEnvVars = [];
export const registry = 'https://registry.npmjs.org';
export const rootDir = findRootDir();
export const responseHeadersOk = {
    'Cache-Control': 's-maxage=5184000, stale-while-revalidate'
};
const env = process.env;
export const tmpDir = env.TMP_DIR || '/tmp/windpack';
makeTmpDir(tmpDir);
// initialize utilities
function makeTmpDir(_dir) {
    try {
        rimraf.sync(_dir);
    }
    catch (err) {
        // not exists
    }
    try {
        mkdirp.sync(_dir);
    }
    catch (err) {
        console.error('can not create tmpDir', _dir);
        console.error(err.stack || err.message || err);
        process.exit(1);
    }
}
function findRootDir() {
    // module=esnext
    let dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
    // let dir = __dirname; // target=es5
    while (dir !== '/') {
        try {
            const stat = fs.statSync(`${dir}/package.json`);
            return dir;
        }
        catch (e) {
            // not found, try again
            dir = path.dirname(dir);
        }
    }
}
//# sourceMappingURL=config.js.map