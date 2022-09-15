import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'
import crypto from 'crypto'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import sgMail from '@sendgrid/mail'
import { FROM_EMAIL, JWT_SECRET } from '#configuration'

/**
 * Capitalizes all words in a string
 * @param {string} words The string to capitalize
 * @returns {string} The string with all its words capitalized
 */

export const capitalizeWords = (words) => {
  const result = words.replace(/\b(\w)/g, (letter) => letter.toUpperCase())
  return result
}

/**
 * Checks if date is after today
 * @param {Date} date The date to check
 * @returns {boolean} True / False
 */

export const checkDate = (date) => {
  const today = new Date().getTime()
  const day = date.getTime()
  const result = day > today

  return result
}

/**
 * Checks if password matches passwordHash
 * @param {string} password The password from input
 * @param {string} passwordHash The password hash with which to compare
 * @returns {Promise<boolean>} True / False
 */

export const checkPassword = async (password, passwordHash) => {
  const passwordsMatch = await bcrypt.compare(password, passwordHash)
  return passwordsMatch
}

/**
 * Encrypts a password
 * @param {string} password The password before encrypting it
 * @returns {Promise<string>} The password encrypted
 */

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  return passwordHash
}

/**
 * Generates a jwt token from the given user id
 * @param {string} userId The user id from which to generate the token
 * @returns {string} The jwt token from user id
 */

export const generateJwtToken = (userId) => {
  const jwtToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' })
  return jwtToken
}

/**
 * Generates a token from a string with expiry date
 * @returns {{hash: string, expiry: Date}} The token and its expiry
 */

export const generateToken = () => {
  const buffer = crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  const tenMinutes = Date.now() + 10 * 60 * 1000
  const expiry = new Date(tenMinutes)
  const data = { hash, expiry }

  return data
}

/**
 * Sends an email to Send Grid
 * @param {string} toEmail The user's email address
 * @param {('Reset password' | 'Verify account')} _subject The subject for the email
 * @param {string} fullName The user's full name
 * @param {string} token The hashed token for the link query parameter
 * @returns {Promise<void>}
 */

export const sendEmail = async (toEmail, _subject, fullName, token) => {
  const subject = _subject.split(' ').join(' your ')
  const subjectLowerCase = subject.toLowerCase()
  const subjectKebabCase = subjectLowerCase.replace(' your ', '-')

  const data = {
    to: toEmail,
    from: FROM_EMAIL,
    subject,
    html: `
      <p>
        Hi ${fullName}. Please click the link below to ${subjectLowerCase}.
      </p>

      <p>
        <a href="http://localhost:3000/${subjectKebabCase}?token=${token}">
          Click here
        </a>
      </p>
    `,
  }

  await sgMail.send(data)
}

/**
 * Splits a camel case string into a single text string
 * @param {string} words The camel case string to split
 * @returns {string} The resulting text string
 */

export const splitWords = (words) => {
  const result = words.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)

  return finalResult
}

/**
 * Uploads a file to Cloudinary
 * @param {string} file The path to the file to upload
 * @returns {Promise<string>} A secure url to the file uploaded
 */

export const uploadFile = async (file) => {
  const { secure_url: fileUrl } = await cloudinary.v2.uploader.upload(file)
  fs.unlinkSync(file)

  return fileUrl
}
