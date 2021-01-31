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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execWithTimeout = exports.fetchAndExtractBundle = exports.resolveTag = exports.loadMeta = void 0;
var fs_1 = __importDefault(require("fs"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var preload_js_1 = __importDefault(require("semver/preload.js"));
var stream_1 = require("stream");
var tar = __importStar(require("tar"));
var util_1 = require("util");
var httpx_js_1 = require("./httpx.js");
var parse_js_1 = require("./parse.js");
var logger_js_1 = require("./util/logger.js");
var registry = 'https://registry.npmjs.org';
var pipeline = util_1.promisify(stream_1.pipeline);
function loadMeta(fullname) {
    return __awaiter(this, void 0, void 0, function () {
        var metaUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metaUrl = registry + "/" + encodeURIComponent(fullname).replace('%40', '@');
                    return [4 /*yield*/, httpx_js_1.fetchJson(metaUrl)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.loadMeta = loadMeta;
function resolveTag(meta, fullname, tag, filepath) {
    if (meta.name !== fullname || !meta.versions) {
        logger_js_1.ll.error("invalid module: " + fullname);
        return httpx_js_1.response(400, 'invalid module');
    }
    var version = parse_js_1.findVersion(meta, tag);
    if (!preload_js_1.default.valid(version)) {
        logger_js_1.ll.error("invalid tag: " + fullname);
        return httpx_js_1.response(400, 'invalid tag');
    }
    if (version !== tag) {
        var url = "/" + meta.name + "@" + version;
        if (filepath)
            url += "/" + filepath;
        return httpx_js_1.redirect(302, url);
    }
}
exports.resolveTag = resolveTag;
// npm modules always extract with 'package' directory
function fetchAndExtractBundle(fullname, tarUrl, dir) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, outFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mkdirp_1.default(dir)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, node_fetch_1.default(tarUrl)];
                case 2:
                    resp = _a.sent();
                    if (!resp.ok)
                        throw new Error("unexpected response " + resp.statusText);
                    outFile = dir + "/package.tgz";
                    return [4 /*yield*/, pipeline(resp.body, fs_1.default.createWriteStream(outFile))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tar.extract({ file: outFile, cwd: dir })];
                case 4:
                    _a.sent();
                    logger_js_1.ll.debug('extracted', fullname, outFile, dir);
                    return [2 /*return*/, dir + '/package'];
            }
        });
    });
}
exports.fetchAndExtractBundle = fetchAndExtractBundle;
function execWithTimeout(timeout) {
    var promises = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        promises[_i - 1] = arguments[_i];
    }
    var timeoutId;
    var countDown = new Promise(function (_, reject) {
        timeoutId = setTimeout(reject, timeout, new Error('timed out'));
    });
    return Promise.race(__spreadArrays([countDown], promises))
        .then(function (result) {
        clearTimeout(timeoutId);
        return result;
    });
}
exports.execWithTimeout = execWithTimeout;
//# sourceMappingURL=load.js.map