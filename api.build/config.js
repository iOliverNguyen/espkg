import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';
export const downloadTimeout = 3000;
export const enableDebug = true;
export const npmInstallEnvVars = [];
export const registry = 'https://registry.npmjs.org';
export const rootDir = findRootDir();
export const responseHeaderOrigin = {
    'Access-Control-Allow-Origin': '*',
};
export const responseHeadersOk = {
    'Cache-Control': 's-maxage=5184000, stale-while-revalidate',
    'Content-Type': 'text/javascript',
};
const env = process.env;
export const tmpDir = env.TMP_DIR || '/tmp/jspack';
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
    // let dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
    // vercel does not support import yet, have to use es5
    let dir = __dirname; // tsconfig.json: target=es5
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
    console.log('-- rootDir', rootDir);
}
//# sourceMappingURL=config.js.map