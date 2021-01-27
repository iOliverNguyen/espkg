import {strict as assert} from 'assert';
import * as rr from './parse.js';


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
].forEach(({input, expected}) => {
  const res = rr.parsePath(input);
  if (res) delete res.url;

  console.log(`parsed ${input}:`, res);
  assert.deepEqual(res, expected);
});
