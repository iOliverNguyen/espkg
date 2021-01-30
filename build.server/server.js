"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var compression_1 = __importDefault(require("compression"));
var express_1 = __importDefault(require("express"));
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var config_js_1 = require("./api/config.js");
// import routes from './api/routes.js';
var logger_js_1 = require("./util/logger.js");
// const pkgInfo = require('../package.json');
// const padRight = require('./utils/padRight.js');
// const servePackage = require('./serve-package.js');
// const logger = require('./logger.js');
// const cache = require('./cache.js');
// const { debugEndpoints, root, tmpdir } = require('../config.js');
var app = express_1.default();
var port = process.env.PORT || 9000;
app.use(serve_favicon_1.default(config_js_1.rootDir + "/static/favicon.ico"));
app.use(compression_1.default());
// if (debugEndpoints === true) {
//   app.get('/_log', (req, res) => {
//     const filter = req.query.filter;
//     if (filter) {
//       const rl = readline.createInterface({
//         input: fs.createReadStream(`${tmpdir}/log`)
//       });
//
//       const pattern = new RegExp(`^packd \\w+ \\[${req.query.filter}\\]`);
//
//       rl.on('line', line => {
//         if (pattern.test(line)) res.write(line + '\n');
//       });
//
//       rl.on('close', () => {
//         res.end();
//       });
//     } else {
//       res.sendFile(`${tmpdir}/log`);
//     }
//   });
//
//   app.get('/_cache', (req, res) => {
//     res.status(200);
//     res.set({
//       'Content-Type': 'text/plain'
//     });
//
//     res.write(`Total cached bundles: ${prettyBytes(cache.length)}\n`);
//
//     const table = [];
//     let maxKey = 7; // 'package'.length
//     let maxSize = 4; // 'size'.length
//
//     cache.forEach((value, pkg) => {
//       const size = value.length;
//       const sizeLabel = prettyBytes(size);
//
//       table.push({ pkg, size, sizeLabel });
//
//       maxKey = Math.max(maxKey, pkg.length);
//       maxSize = Math.max(maxSize, sizeLabel.length);
//     });
//
//     if (req.query.sort === 'size') {
//       table.sort((a, b) => b.size - a.size);
//     }
//
//     const separator = padRight('', maxKey + maxSize + 5, '─');
//
//     res.write(`┌${separator}┐\n`);
//     res.write(
//       `│ ${padRight('package', maxKey)} │ ${padRight('size', maxSize)} │\n`
//     );
//     res.write(`├${separator}┤\n`);
//
//     table.forEach(row => {
//       res.write(
//         `│ ${padRight(row.pkg, maxKey)} │ ${padRight(
//           row.sizeLabel,
//           maxSize
//         )} │\n`
//       );
//     });
//     res.write(`└${separator}┘\n`);
//
//     res.end();
//   });
// }
// log requests
app.use(function (req, res, next) {
    var remoteAddr = (function () {
        if (req.ip)
            return req.ip;
        var sock = req.socket;
        if (sock.socket)
            return sock.socket.remoteAddress;
        if (sock.remoteAddress)
            return sock.remoteAddress;
        return ' - ';
    })();
    var date = new Date().toUTCString();
    var url = req.originalUrl || req.url;
    var httpVersion = req.httpVersionMajor + '.' + req.httpVersionMinor;
    logger_js_1.ll.log(remoteAddr + " - - [" + date + "] \"" + req.method + " " + url + " HTTP/" + httpVersion + "\"");
    next();
});
// redirect /bundle/foo to /foo
// app.get('/bundle/:id', (req, res) => {
//   const queryString = Object.keys(req.query)
//     .map(key => `${key}=${encodeURIComponent(req.query[key])}`)
//     .join('&');
//
//   let url = req.url.replace('/bundle', '');
//   if (queryString) url += `?${queryString}`;
//
//   res.redirect(301, url);
// });
app.use(express_1.default.static(config_js_1.rootDir + "/build.static", {
    maxAge: 600,
}));
// app.use(routes);
// app.get('/', (req, res) => {
//   res.status(200);
//   res.end('hello!');
// const index = fs
//   .readFileSync(`${root}/server/templates/index.html`, 'utf-8')
//   .replace('__VERSION__', pkgInfo.version);
//
// res.set('Content-Type', 'text/html');
// res.end(index);
// });
app.listen(port, function () {
    logger_js_1.ll.log("started at " + new Date().toUTCString());
    logger_js_1.ll.log('listening on localhost:' + port);
    if (process.send)
        process.send('start');
});
//# sourceMappingURL=server.js.map