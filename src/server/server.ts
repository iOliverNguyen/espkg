import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import {rootDir} from './api/config.js';
// import routes from './api/routes.js';
import {ll} from './util/logger.js';

// const pkgInfo = require('../package.json');
// const padRight = require('./utils/padRight.js');
// const servePackage = require('./serve-package.js');
// const logger = require('./logger.js');
// const cache = require('./cache.js');

// const { debugEndpoints, root, tmpdir } = require('../config.js');

const app = express();
const port = process.env.PORT || 9000;

app.use(favicon(`${rootDir}/static/favicon.ico`));
app.use(compression());

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
app.use((req, res, next) => {
  const remoteAddr = (() => {
    if (req.ip) return req.ip;
    const sock = req.socket;
    if (sock.socket) return sock.socket.remoteAddress;
    if (sock.remoteAddress) return sock.remoteAddress;
    return ' - ';
  })();
  const date = new Date().toUTCString();
  const url = req.originalUrl || req.url;
  const httpVersion = req.httpVersionMajor + '.' + req.httpVersionMinor;

  ll.log(
    `${remoteAddr} - - [${date}] "${req.method} ${url} HTTP/${httpVersion}"`,
  );
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

app.use(
  express.static(`${rootDir}/build.static`, {
    maxAge: 600,
  }),
);

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

app.listen(port, () => {
  ll.log(`started at ${new Date().toUTCString()}`);
  ll.log('listening on localhost:' + port);
  if (process.send) process.send('start');
});
