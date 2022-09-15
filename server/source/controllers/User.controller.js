import e from 'express'
import { Category, Comment, Post, User } from '#models'
import * as types from '#types'
import * as utils from '#utilities'

/**
 * @param {e.Request<{}, {}, types.USER, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const SignUp = async (request, response) => {
  const { email, password, firstName, lastName } = request.body
  const user = new User()
  const message = '✔️ You have successfully signed up'

  user.email = email
  user.passwordHash = await utils.encryptPassword(password)
  user.firstName = utils.capitalizeWords(firstName)
  user.lastName = utils.capitalizeWords(lastName)
  await user.save()

  response.status(201).send({ message, email })
}

/**
 * @param {e.Request<{}, {}, types.AUTH, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const SignIn = async (request, response) => {
  const { email, password } = request.body
  const user = await User.findOne({ email })
  const passwordIsCorrect = await utils.checkPassword(password, user.passwordHash)
  const accessToken = utils.generateJwtToken(user.id)
  const fullName = user.get('fullName', String)
  const message = `✔️ Hi ${fullName}, you have successfully signed in`

  if (!passwordIsCorrect) {
    const error = utils.createUnauthorizedError('Wrong password')
    throw error
  }

  response.send({ message, accessToken })
}

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} _
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const GetAll = async (_, response) => {
  const users = await User.find({}, null, { sort: 'firstName' })
  const message = '✔️ All users'

  response.send({ message, users })
}

/**
 * @param {e.Request<{}, {}, types.EMAIL, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const ResetPasswordByEmail = async (request, response) => {
  const { email } = request.body
  const { hash, expiry } = utils.generateToken()
  const user = await User.findOne({ email })
  const message = '✔️ Reset token sent'

  user.passwordResetTokenHash = hash
  user.passwordResetTokenExpiry = expiry
  await user.save()

  const subject = 'Reset password'
  const fullName = user.get('fullName', String)
  const token = user.passwordResetTokenHash

  await utils.sendEmail(email, subject, fullName, token)
  response.send({ message })
}

/**
 * @param {e.Request<{}, {}, types.PASSWORD, types.TOKEN, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const ResetPasswordByToken = async (request, response) => {
  const tokenHash = request.query.token
  const { password } = request.body
  const user = await User.findOne({ passwordResetTokenHash: tokenHash })
  const tokenExpiry = user.passwordResetTokenExpiry
  const tokenIsValid = utils.checkDate(tokenExpiry)
  const message = '✔️ Password reset'

  if (!tokenIsValid) {
    const error = utils.createUnauthorizedError('Reset password token expired')
    throw error
  }

  user.passwordHash = await utils.encryptPassword(password)
  user.passwordResetTokenHash = undefined
  user.passwordResetTokenExpiry = undefined
  await user.save()

  response.send({ message, user })
}

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const GetMe = async (request, response) => {
  const userId = request.user.id
  const user = await User.findById(userId)
  const message = '✔️ User detail'

  response.send({ message, user })
}

/**
 * @param {e.Request<{}, {}, types.USER, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const UpdateMe = async (request, response) => {
  const userId = request.user.id
  const { email, password, firstName, lastName, biography } = request.body
  const user = await User.findById(userId)
  const message = '✔️ User edited'

  user.email = email
  user.passwordHash = await utils.encryptPassword(password)
  user.firstName = utils.capitalizeWords(firstName)
  user.lastName = utils.capitalizeWords(lastName)
  user.biography = biography
  await user.save()

  response.send({ message, user })
}

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const UploadPhoto = async (request, response) => {
  const userId = request.user.id
  const _photo = request.file.path
  const user = await User.findById(userId)
  const photo = await utils.uploadFile(_photo)
  const message = '✔️ Photo uploaded'

  user.photo = photo
  await user.save()

  response.send({ message, user })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Follow = async (request, response) => {
  const userId = request.user.id
  const anotherId = request.params.id
  const user = await User.findById(userId)
  const another = await User.findById(anotherId)
  const alreadyFollowing = user.following.includes(another.id)
  const message = '✔️ Followed'

  if (alreadyFollowing) {
    const error = utils.createValidationError('User already following')
    throw error
  }

  user.following.push(another.id)
  await user.save()

  another.followers.push(user.id)
  await another.save()

  response.send({ message })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Unfollow = async (request, response) => {
  const userId = request.user.id
  const anotherId = request.params.id
  const user = await User.findById(userId)
  const another = await User.findById(anotherId)
  const message = '✔️ Unfollowed'

  user.following = user.following.filter((id) => id !== another.id)
  await user.save()

  another.followers = another.followers.filter((id) => id !== user.id)
  await another.save()

  response.send({ message })
}

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const DeleteMe = async (request, response) => {
  const userId = request.user.id
  const user = await User.findById(userId)
  const message = '✔️ User deleted'

  await Category.deleteMany({ user: user.id })
  await Comment.deleteMany({ user: user.id })
  await Post.deleteMany({ user: user.id })
  await User.updateMany({}, { $pull: { following: user.id, followers: user.id } })
  await user.remove()

  response.send({ message })
}

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const VerifyMeByEmail = async (request, response) => {
  const userId = request.user.id
  const { hash, expiry } = utils.generateToken()
  const user = await User.findById(userId)
  const message = `✔️ Verification token sent`

  user.verificationTokenHash = hash
  user.verificationTokenExpiry = expiry
  await user.save()

  const { email, passwordResetTokenHash: token } = user
  const subject = 'Verify account'
  const fullName = user.get('fullName', String)

  await utils.sendEmail(email, subject, fullName, token)
  response.send({ message })
}

/**
 * @param {e.Request<{}, {}, {}, types.TOKEN, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const VerifyMeByToken = async (request, response) => {
  const userId = request.user.id
  const tokenHash = request.query.token
  const user = await User.findOne({ _id: userId, verificationTokenHash: tokenHash })
  const tokenExpiry = user.verificationTokenExpiry
  const tokenIsValid = utils.checkDate(tokenExpiry)
  const message = '✔️ Account verified'

  if (!tokenIsValid) {
    const error = utils.createUnauthorizedError('Verification token expired')
    throw error
  }

  user.isVerified = true
  user.verificationTokenHash = undefined
  user.verificationTokenExpiry = undefined
  await user.save()

  response.send({ message, user })
}
