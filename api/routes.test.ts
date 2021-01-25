import * as rr from './routes'

const assert = require('assert').strict;

[
  {
    input: '/abc@123@456',
    expected: undefined
  },
  {
    input: '/react-native@^v1.2.4',
    expected: {
      namespace: undefined, name: 'react-native',
      qualifier: 'react-native', tag: '^v1.2.4',
      filepath: undefined
    }
  },
  {
    input: '/@hello/react-native@^v1.2.4',
    expected: {
      namespace: '@hello', name: 'react-native',
      qualifier: '@hello/react-native', tag: '^v1.2.4',
      filepath: undefined
    }
  },
  {
    input: '/@hello/react-native@^v1.2.4-alpha?hello',
    expected: {
      namespace: '@hello', name: 'react-native',
      qualifier: '@hello/react-native', tag: '^v1.2.4-alpha',
      filepath: undefined
    }
  },
  {
    input: '/@hello/react-native@^v1.2.4-alpha/sample/01.js?hello',
    expected: {
      namespace: '@hello', name: 'react-native',
      qualifier: '@hello/react-native', tag: '^v1.2.4-alpha',
      filepath: '/sample/01.js'
    }
  },
].forEach(({input, expected}) => {
  const res = rr.parsePath(input)
  if (res) delete res.url
  console.log(`parsed ${input}:`, res)
  assert.deepEqual(res, expected)
})
