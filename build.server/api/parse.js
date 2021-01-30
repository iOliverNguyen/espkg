import semver from 'semver';
import { URL } from "url";
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
const rePath = new RegExp(`` +
    //    12...................2..1      : namespace (2)
    `^\/((@[A-Za-z0-9-]{1,64})\/)?` +
    // 3.....................3           : package name (3)
    `([A-Za-z0-9._-]{1,214})` +
    // 4.5..........................54   : version (5)
    `(@([a-zA-Z<=>^~0-9*.+-]{1,32}))?` +
    // 6........6                        : file path (6)
    `(\/[^?#]+)?`);
// url must start with /
export function parsePath(input) {
    if (input[0] !== '/')
        throw new Error(`unexpected url format: ${input}`);
    const parsedUrl = new URL('http://localhost' + input);
    const urlPath = parsedUrl.pathname;
    const parts = rePath.exec(urlPath);
    if (!parts)
        return;
    const [, , namespace, shortname, , tag, filepath] = parts;
    const remain = urlPath.slice(parts[0].length);
    if (remain)
        return;
    const fullname = namespace ? namespace + '/' + shortname : shortname;
    return { namespace, shortname, fullname, tag, filepath, url: parsedUrl };
}
export function findVersion(meta, tag) {
    // valid version
    if (semver.valid(tag))
        return meta.versions[tag] && tag;
    // dist tag
    const distTags = meta['dist-tags'];
    if (tag in distTags)
        return distTags[tag];
    // semver range
    return semver.maxSatisfying(Object.keys(meta.versions), tag);
}
//# sourceMappingURL=parse.js.map