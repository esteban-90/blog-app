import { NODE_ENV } from '#configuration'

/**
 * @param  {...string} params
 * @returns {void}
 */

export const info = (...params) => {
  if (NODE_ENV !== 'test') {
    console.info(...params)
  }
}

/**
 * @param  {...string} params
 * @returns {void}
 */

export const error = (...params) => {
  if (NODE_ENV !== 'test') {
    console.error(...params)
  }
}
