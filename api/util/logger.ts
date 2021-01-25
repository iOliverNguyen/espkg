import * as fs from 'fs'
import minilog from 'minilog'

import {tmpDir} from '../config'

export const logFilePath = `${tmpDir}/server.log`

minilog.enable()
minilog.pipe(fs.createWriteStream(logFilePath))

export const ll = minilog('log')
