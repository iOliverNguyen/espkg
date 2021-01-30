"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVersion = exports.parsePath = void 0;
var semver_1 = __importDefault(require("semver"));
var url_1 = require("url");
/**
 npm package naming, let's use the simplest rules:
 - max 214 chars
 - only dots, dashes, and underscores (. - _)
 - distinct between uppercase and lowercase, both are different packages:
 https://www.npmjs.com/package/JSONStream
 https://www.npmjs.com/package/jsonstream

 References:
 - username         https://docs.npmjs.com/creating-a-new-npm-user-account
 - package name     https://github.com/npm/validate-npm-package-name
 - semantic version https://devhints.io/semver
 */
var rePath = new RegExp("" +
    //    12...................2..1      : namespace (2)
    "^/((@[A-Za-z0-9-]{1,64})/)?" +
    // 3.....................3           : package name (3)
    "([A-Za-z0-9._-]{1,214})" +
    // 4.5..........................54   : version (5)
    "(@([a-zA-Z<=>^~0-9*.+-]{1,32}))?" +
    // 6........6                        : file path (6)
    "(/[^?#]+)?");
// url must start with /
function parsePath(input) {
    if (input[0] !== '/')
        throw new Error("unexpected url format: " + input);
    var parsedUrl = new url_1.URL('http://localhost' + input);
    var urlPath = parsedUrl.pathname;
    var parts = rePath.exec(urlPath);
    if (!parts)
        return;
    var namespace = parts[2], shortname = parts[3], tag = parts[5], filepath = parts[6];
    var remain = urlPath.slice(parts[0].length);
    if (remain)
        return;
    var fullname = namespace ? namespace + '/' + shortname : shortname;
    return { namespace: namespace, shortname: shortname, fullname: fullname, tag: tag, filepath: filepath, url: parsedUrl };
}
exports.parsePath = parsePath;
function findVersion(meta, tag) {
    // valid version
    if (semver_1.default.valid(tag))
        return meta.versions[tag] && tag;
    // dist tag
    var distTags = meta['dist-tags'];
    if (tag in distTags)
        return distTags[tag];
    // semver range
    return semver_1.default.maxSatisfying(Object.keys(meta.versions), tag);
}
exports.findVersion = findVersion;
//# sourceMappingURL=parse.js.map