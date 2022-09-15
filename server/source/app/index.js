import '#connection'

import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import helmet from 'helmet'

import { API_URL, NODE_ENV } from '#configuration'
import { errorHandler, notFoundHandler, requestLogger, userAuthenticator } from '#middlewares'
import { privateRouter, publicRouter } from '#routers'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(userAuthenticator)

if (NODE_ENV === 'development') {
  requestLogger.toConsole(app)
  requestLogger.toFile(app)
}

app.use(API_URL, publicRouter)
app.use(`${API_URL}/account`, privateRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
