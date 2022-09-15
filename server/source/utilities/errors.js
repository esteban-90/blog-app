import mongoose from 'mongoose'
import { UnauthorizedError } from 'express-jwt'

/**
 * Creates a DocumentNotFoundError from Mongoose
 * @param {string} message The error message to display
 * @returns {mongoose.Error.DocumentNotFoundError} DocumentNotFoundError
 */

export const createNotFoundError = (message) => {
  const error = new mongoose.Error.DocumentNotFoundError(message)
  return error
}

/**
 * Creates an UnauthorizedError from Express JWT
 * @param {string} message The error message to display
 * @returns {UnauthorizedError} UnauthorizedError
 */

export const createUnauthorizedError = (message) => {
  const error = new UnauthorizedError(null, { message })
  return error
}

/**
 * Creates a ValidationError from Mongoose
 * @param {string} message The error message to display
 * @returns {mongoose.Error.ValidationError} ValidationError
 */

export const createValidationError = (message) => {
  const error = new mongoose.Error.ValidationError()
  error.message = message

  return error
}
