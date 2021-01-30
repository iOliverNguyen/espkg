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
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var rr = __importStar(require("./parse.js"));
[
    {
        input: '/abc@123@456',
        expected: undefined,
    },
    {
        input: '/react-native@^v1.2.4',
        expected: {
            namespace: undefined, shortname: 'react-native', tag: '^v1.2.4',
            fullname: 'react-native', filepath: undefined,
        },
    },
    {
        input: '/@hello/react-native@^v1.2.4',
        expected: {
            namespace: '@hello', shortname: 'react-native', tag: '^v1.2.4',
            fullname: '@hello/react-native', filepath: undefined,
        },
    },
    {
        input: '/@hello/react-native@^v1.2.4-alpha?hello',
        expected: {
            namespace: '@hello', shortname: 'react-native', tag: '^v1.2.4-alpha',
            fullname: '@hello/react-native', filepath: undefined,
        },
    },
    {
        input: '/@hello/react-native@^v1.2.4-alpha/sample/01.js?hello',
        expected: {
            namespace: '@hello', shortname: 'react-native', tag: '^v1.2.4-alpha',
            fullname: '@hello/react-native', filepath: '/sample/01.js',
        },
    },
].forEach(function (_a) {
    var input = _a.input, expected = _a.expected;
    var res = rr.parsePath(input);
    if (res)
        delete res.url;
    console.log("parsed " + input + ":", res);
    assert_1.strict.deepEqual(res, expected);
});
//# sourceMappingURL=parse.test.js.map