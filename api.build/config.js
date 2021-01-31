"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpDir = exports.responseHeadersOk = exports.responseHeaderOrigin = exports.rootDir = exports.registry = exports.npmInstallEnvVars = exports.enableDebug = exports.downloadTimeout = void 0;
var fs_1 = __importDefault(require("fs"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var path_1 = __importDefault(require("path"));
var rimraf_1 = __importDefault(require("rimraf"));
exports.downloadTimeout = 3000;
exports.enableDebug = true;
exports.npmInstallEnvVars = [];
exports.registry = 'https://registry.npmjs.org';
exports.rootDir = findRootDir();
exports.responseHeaderOrigin = {
    'Access-Control-Allow-Origin': '*',
};
exports.responseHeadersOk = {
    'Cache-Control': 's-maxage=5184000, stale-while-revalidate',
    'Content-Type': 'text/javascript',
};
var env = process.env;
exports.tmpDir = env.TMP_DIR || '/tmp/jspack';
makeTmpDir(exports.tmpDir);
// initialize utilities
function makeTmpDir(_dir) {
    try {
        rimraf_1.default.sync(_dir);
    }
    catch (err) {
        // not exists
    }
    try {
        mkdirp_1.default.sync(_dir);
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
    var dir = __dirname; // tsconfig.json: target=es5
    while (dir !== '/') {
        try {
            var stat = fs_1.default.statSync(dir + "/package.json");
            return dir;
        }
        catch (e) {
            // not found, try again
            dir = path_1.default.dirname(dir);
        }
    }
    console.log('-- rootDir', exports.rootDir);
}
//# sourceMappingURL=config.js.map