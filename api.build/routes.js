"use strict";
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
exports.serve = exports.debug = exports.router = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var bundle_js_1 = require("./bundle.js");
var config_js_1 = require("./config.js");
var httpx_js_1 = require("./httpx.js");
var load_js_1 = require("./load.js");
var parse_js_1 = require("./parse.js");
var logger_js_1 = require("./util/logger.js");
function default_1(req, res) {
    return router(req, res).catch(function (err) {
        logger_js_1.ll.error("serving " + req.url + ": " + httpx_js_1.errorContent(err));
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(500).send(httpx_js_1.errorContent(err));
        }
    });
}
exports.default = default_1;
function router(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            url = new URL('http://localhost' + req.url);
            if (url.pathname === '/__debug@')
                return [2 /*return*/, debug(req, res)];
            return [2 /*return*/, serve(req, res)];
        });
    });
}
exports.router = router;
function debug(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rr, pkgJson, dirs, _i, dirs_1, dir, dirpath, _a, dirs_2, dir;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rr = {
                        rootDir: config_js_1.rootDir,
                    };
                    return [4 /*yield*/, bundle_js_1.readJsonFile(config_js_1.rootDir + "/package.json")];
                case 1:
                    pkgJson = _b.sent();
                    rr.package = pkgJson;
                    console.log('package json', JSON.stringify(pkgJson));
                    dirs = fs_1.default.readdirSync("" + config_js_1.rootDir);
                    for (_i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
                        dir = dirs_1[_i];
                        rr.root = dirs;
                    }
                    dirpath = req.query['dirpath'];
                    if (dirpath) {
                        dirs = fs_1.default.readdirSync(path_1.default.resolve(config_js_1.rootDir, dirpath));
                        for (_a = 0, dirs_2 = dirs; _a < dirs_2.length; _a++) {
                            dir = dirs_2[_a];
                            console.log('dir:', dir);
                        }
                        rr.lib = dirs;
                    }
                    res.status(400).json(rr);
                    return [2 /*return*/];
            }
        });
    });
}
exports.debug = debug;
function serve(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var method, url, pp, fullname, tag, filepath, meta, respData, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendHeaders(res, config_js_1.responseHeaderOrigin);
                    method = req.method, url = req.url;
                    if (method !== 'GET') {
                        res.status(400).json({ msg: 'not found' });
                        return [2 /*return*/];
                    }
                    pp = parse_js_1.parsePath(url);
                    if (!pp) {
                        res.status(400).json({ msg: "malform url" });
                        return [2 /*return*/];
                    }
                    fullname = pp.fullname, tag = pp.tag, filepath = pp.filepath;
                    if (!tag)
                        tag = 'latest';
                    return [4 /*yield*/, load_js_1.loadMeta(fullname)];
                case 1:
                    meta = _a.sent();
                    logger_js_1.ll.info("package: " + fullname);
                    respData = load_js_1.resolveTag(meta, fullname, tag, filepath);
                    if (respData) {
                        return [2 /*return*/, httpx_js_1.sendResponse(res, respData)];
                    }
                    return [4 /*yield*/, bundle_js_1.downloadAndConvertPackage(meta, fullname, tag, filepath)];
                case 2:
                    data = _a.sent();
                    sendHeaders(res, config_js_1.responseHeadersOk);
                    res.status(200).write(data.compiledData);
                    res.end();
                    logger_js_1.ll.info("package: " + fullname + " served");
                    return [2 /*return*/];
            }
        });
    });
}
exports.serve = serve;
function sendHeaders(res, headers) {
    for (var _i = 0, _a = Object.entries(headers); _i < _a.length; _i++) {
        var _b = _a[_i], header = _b[0], value = _b[1];
        res.setHeader(header, value);
    }
}
//# sourceMappingURL=routes.js.map