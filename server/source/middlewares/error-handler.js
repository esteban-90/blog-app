import e from 'express'

const errors = {
  CastError: 400,
  DocumentNotFoundError: 404,
  MulterError: 400,
  UnauthorizedError: 401,
  ValidationError: 400,
}

/**
 * Handles exceptions
 * @param {Error} error
 * @param {e.Request<{}, {}, {}, {}, {}>} _
 * @param {e.Response<{}, {}>} response
 * @param {e.NextFunction} next
 * @returns {void}
 */

const errorHandler = (error, _, response, next) => {
  let { name, message } = error
  if (name === 'ValidationError') message = message.replace('User validation failed: email:', '')
  const status = errors[name] ?? 500

  response.status(status).send({ name, message })
  next()
}

export default errorHandler
