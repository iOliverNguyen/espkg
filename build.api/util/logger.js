import minilog from 'minilog';
// export const logFilePath = `${tmpDir}/server.log`
minilog.enable();
// minilog.pipe(fs.createWriteStream(logFilePath))
export const ll = minilog('log');
//# sourceMappingURL=logger.js.map