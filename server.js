"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : {"default": mod};
};

var express = require("express");
var routes = __importDefault(require('./build.server/api/routes.js'));

var rootDir = __dirname;

var app = express();
var port = process.env.PORT || 9000;

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
  console.log(remoteAddr + " - - [" + date + "] \"" + req.method + " " + url + " HTTP/" + httpVersion + "\"");
  next();
});

app.use(express.static(rootDir + "/build.static", {
  maxAge: 600,
}));

app.use(routes.default);

app.listen(port, function () {
  console.log("started at " + new Date().toUTCString());
  console.log('listening on localhost:' + port);
  if (process.send) {
    process.send('start');
  }
});
