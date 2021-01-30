"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonFile = exports.downloadAndConvertPackage = void 0;
var child_process_1 = require("child_process");
var esinstall = __importStar(require("esinstall"));
var fs_1 = __importDefault(require("fs"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var path_1 = __importDefault(require("path"));
var rimraf_1 = __importDefault(require("rimraf"));
var util_1 = require("util");
var config_js_1 = require("./config.js");
var logger_js_1 = require("../util/logger.js");
var exec = util_1.promisify(child_process_1.exec);
var rimraf = util_1.promisify(rimraf_1.default);
var fsReadFile = util_1.promisify(fs_1.default.readFile);
var fsWriteFile = util_1.promisify(fs_1.default.writeFile);
var fsStat = util_1.promisify(fs_1.default.stat);
function downloadAndConvertPackage(meta, fullname, tag, filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var thisMeta, dist, tarUrl, outterDir, mockPackageJson, webmodulePath, importMapPath, importMap, compiledFilePath, compiledData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thisMeta = meta.versions[tag];
                    dist = thisMeta.dist;
                    tarUrl = dist.tarball;
                    if (!tarUrl) {
                        throw new Error('can not download package');
                    }
                    outterDir = config_js_1.tmpDir + "/" + fullname + "-" + tag + "-" + dist.shasum;
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
                    logger_js_1.ll.debug("working in " + outterDir);
                    try {
                        rimraf(outterDir);
                    }
                    catch (e) {
                    }
                    return [4 /*yield*/, mkdirp_1.default(outterDir)];
                case 1:
                    _a.sent();
                    mockPackageJson = {
                        name: 'mock',
                        description: 'sample description',
                        version: '0.0.1',
                        private: true,
                        dependencies: {},
                    };
                    Object.assign(mockPackageJson.dependencies, thisMeta.peerDependencies);
                    mockPackageJson.dependencies[fullname] = tag;
                    return [4 /*yield*/, fsWriteFile(outterDir + "/package.json", JSON.stringify(mockPackageJson, null, '  '))];
                case 2:
                    _a.sent();
                    // install dependencies
                    logger_js_1.ll.debug("installing dependencies...");
                    return [4 /*yield*/, installDependencies(outterDir)];
                case 3:
                    _a.sent();
                    logger_js_1.ll.debug("installed dependencies");
                    // run esinstall
                    return [4 /*yield*/, esinstall.install([fullname], {
                            cwd: outterDir,
                            polyfillNode: true,
                        })];
                case 4:
                    // run esinstall
                    _a.sent();
                    webmodulePath = outterDir + "/web_modules";
                    importMapPath = outterDir + "/web_modules/import-map.json";
                    return [4 /*yield*/, readJsonFile(importMapPath)];
                case 5:
                    importMap = _a.sent();
                    compiledFilePath = path_1.default.resolve(webmodulePath, importMap.imports[fullname]);
                    return [4 /*yield*/, fsReadFile(compiledFilePath)];
                case 6:
                    compiledData = (_a.sent()).toString();
                    return [2 /*return*/, {
                            compiledData: compiledData,
                        }];
            }
        });
    });
}
exports.downloadAndConvertPackage = downloadAndConvertPackage;
function readJsonFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsReadFile(path)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, JSON.parse(data.toString())];
            }
        });
    });
}
exports.readJsonFile = readJsonFile;
function sanitizePkg(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var pkg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readJsonFile(cwd + "/package.json")];
                case 1:
                    pkg = _a.sent();
                    pkg.scripts = {};
                    return [2 /*return*/, fsWriteFile(cwd + "/package.json", JSON.stringify(pkg, null, '  '))];
            }
        });
    });
}
function installDependencies(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var envVariables, installCommand, execRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    envVariables = config_js_1.npmInstallEnvVars.join(' ');
                    installCommand = envVariables + " node " + config_js_1.rootDir + "/build.static/_/_y.js install";
                    return [4 /*yield*/, exec(installCommand, { cwd: cwd })];
                case 1:
                    execRes = _a.sent();
                    if (execRes.stdout)
                        logger_js_1.ll.debug(execRes.stdout);
                    if (execRes.stderr)
                        logger_js_1.ll.error(execRes.stderr);
                    return [2 /*return*/];
            }
        });
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