import e from 'express'
import { Category, User } from '#models'
import * as types from '#types'
import * as utils from '#utilities'

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} _
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const GetAll = async (_, response) => {
  const categories = await Category.find({}, null, { sort: 'createdAt' })
  const message = '✔️ All categories'

  response.send({ message, categories })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const GetOne = async (request, response) => {
  const categoryId = request.params.id
  const category = await Category.findById(categoryId)
  const message = '✔️ Category detail'

  response.send({ message, category })
}

/**
 * @param {e.Request<{}, {}, types.CATEGORY, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Create = async (request, response) => {
  const userId = request.user.id
  const { name } = request.body
  const user = await User.findById(userId)
  const category = new Category()
  const message = '✔️ Category created'

  category.user = user.id
  category.name = utils.capitalizeWords(name)
  await category.save()

  response.send({ message, category })
}

/**
 * @param {e.Request<types.ID, {}, types.CATEGORY, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Update = async (request, response) => {
  const userId = request.user.id
  const categoryId = request.params.id
  const { name } = request.body
  const user = await User.findById(userId)
  const category = await Category.findOne({ _id: categoryId, user: user.id })
  const message = '✔️ Category edited'

  category.name = utils.capitalizeWords(name)
  await category.save()

  response.send({ message, category })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Delete = async (request, response) => {
  const userId = request.user.id
  const categoryId = request.params.id
  const user = await User.findById(userId)
  const category = await Category.findOne({ _id: categoryId, user: user.id })
  const message = '✔️ Category deleted'

  await category.remove()

  response.send({ message })
}
