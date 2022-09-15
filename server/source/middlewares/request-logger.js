import e from 'express'
import fs from 'fs'
import morganBody from 'morgan-body'
import path from 'path'

const logPath = path.join('source/logs/requests.log')
const logStream = fs.createWriteStream(logPath, { flags: 'a' })

const requestLogger = {
  /**
   * Logs requests body to console
   * @param {e.Application} app
   */

  toConsole: (app) => morganBody(app, { stream: logStream, theme: 'darkened', logResponseBody: false }),

  /**
   * Logs requests body to file
   * @param {e.Application} app
   */

  toFile: (app) => morganBody(app, { logResponseBody: false }),
}

export default requestLogger
