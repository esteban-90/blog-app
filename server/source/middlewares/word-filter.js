import e from 'express'
import Filter from 'bad-words'
import * as types from '#types'
import { createValidationError } from '#utilities'

/**
 * @description Filters bad words in body fields
 * @param {e.Request<{}, {}, types.FOR_VALIDATION, {}, {}>} request
 * @param {e.Response<{}, {}>} _
 * @param {e.NextFunction} next
 * @returns {void}
 */

const wordFilter = (request, _, next) => {
  const fields = request.body
  const filter = new Filter()

  for (const field in fields) {
    const word = fields[field]
    const isProfane = filter.isProfane(word)

    if (isProfane) {
      const error = createValidationError("Please, don't use profane words.")
      throw error
    }
  }

  next()
}

export default wordFilter
