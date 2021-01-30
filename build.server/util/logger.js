"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ll = void 0;
var minilog_1 = __importDefault(require("minilog"));
// export const logFilePath = `${tmpDir}/server.log`
minilog_1.default.enable();
// minilog.pipe(fs.createWriteStream(logFilePath))
exports.ll = minilog_1.default('log');
//# sourceMappingURL=logger.js.map