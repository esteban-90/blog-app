/**
 * @typedef {object} ID
 * @property {string} id
 */

/**
 * @typedef {object} USER
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirmation
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [biography]
 */

/**
 * @typedef {object} AUTH
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {object} EMAIL
 * @property {string} email
 */

/**
 * @typedef {object} PASSWORD
 * @property {string} password
 * @property {string} passwordConfirmation
 */

/**
 * @typedef {object} TOKEN
 * @property {string} token
 */

/**
 * @typedef {object} POST
 * @property {string} category
 * @property {string} title
 * @property {string} content
 */

/**
 * @typedef {object} COMMENT
 * @property {string} content
 */

/**
 * @typedef {object} CATEGORY
 * @property {string} name
 */

/**
 * @typedef {USER | POST | COMMENT | CATEGORY | PASSWORD} FOR_VALIDATION
 */

export {}
