import e from 'express'

/**
 * Handles endpoint not found requests
 * @param {e.Request<{}, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {void}
 */

const notFoundHandler = (request, response) => {
  response.status(404).send({ message: `Not Found - ${request.originalUrl}` })
}

export default notFoundHandler
