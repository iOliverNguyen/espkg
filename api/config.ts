import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import * as path from 'path'

export const rootDir = path.resolve(__dirname)
export const registry = 'https://registry.npmjs.org'
export const enableDebug = true

const env = process.env

export const tmpDir: string = env.TMP_DIR || '/tmp/windpack'

try {
  rimraf.sync(tmpDir);
} catch (err) {
  // not exists
}

try {
  mkdirp.sync(tmpDir)
} catch (err) {
  console.error('can not create tmpDir', tmpDir)
  console.error(err.stack || err.message || err)
  process.exit(1)
}
