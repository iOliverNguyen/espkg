var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { downloadAndConvertPackage } from './bundle.js';
import { sendResponse } from './httpx.js';
import { loadMeta, resolveTag } from "./load.js";
import { parsePath } from './parse.js';
import { ll } from './util/logger.js';
export default function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { method, url } = req;
        if (method !== 'GET') {
            res.status(404).json({ code: 'not found' });
            return;
        }
        const pp = parsePath(url);
        if (!pp) {
            res.status(200).send(`malform url`);
            return;
        }
        const { namespace, shortname, fullname, tag, filepath } = pp;
        const meta = yield loadMeta(fullname);
        ll.info(`package: ${meta.name}`);
        let respData = resolveTag(meta, fullname, tag, filepath);
        if (respData)
            return sendResponse(res, respData);
        const data = yield downloadAndConvertPackage(meta, fullname, tag, filepath);
        res.status(200).write(data);
        res.end();
    });
}
//# sourceMappingURL=routes.js.map