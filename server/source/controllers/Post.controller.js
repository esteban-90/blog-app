import e from 'express'
import { Category, Comment, Post, User } from '#models'
import * as types from '#types'
import * as utils from '#utilities'

/**
 * @param {e.Request<{}, {}, {}, {}, {}>} _
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const GetAll = async (_, response) => {
  const posts = await Post.find({}, null, { sort: 'title' })
  const message = '✔️ All posts'

  response.send({ message, posts })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const GetOne = async (request, response) => {
  const postId = request.params.id
  const post = await Post.findById(postId)
  const message = '✔️ Post detail'

  post.views++
  await post.save()

  response.send({ message, post })
}

/**
 * @param {e.Request<{}, {}, types.POST, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Create = async (request, response) => {
  const userId = request.user.id
  const { category, title, content } = request.body
  const user = await User.findById(userId)
  const _category = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } })
  const post = new Post()
  const message = '✔️ Post created'

  post.user = user.id
  post.category = _category.id
  post.title = utils.capitalizeWords(title)
  post.content = content
  await post.save()

  user.posts.push(post.id)
  await user.save()

  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, types.POST, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Update = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const { category, title, content } = request.body
  const user = await User.findById(userId)
  const _category = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } })
  const post = await Post.findOne({ _id: postId, user: user.id })
  const message = '✔️ Post edited'

  post.category = _category.id
  post.title = utils.capitalizeWords(title)
  post.content = content
  await post.save()

  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const UploadImage = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const _image = request.file.path
  const user = await User.findById(userId)
  const post = await Post.findOne({ _id: postId, user: user.id })
  const image = await utils.uploadFile(_image)
  const message = '✔️ Image uploaded'

  post.image = image
  await post.save()

  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Delete = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const user = await User.findById(userId)
  const post = await Post.findOne({ _id: postId, user: user.id })
  const message = '✔️ Post deleted'

  user.posts = user.posts.filter((id) => id !== post.id)
  await user.save()
  await Comment.deleteMany({ post: post.id })
  await post.remove()

  response.send({ message })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Like = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const user = await User.findById(userId)
  const post = await Post.findById(postId)
  const userLiked = post.likers.includes(user.id)
  const userDisliked = post.dislikers.includes(user.id)
  const message = '✔️ Liked'

  if (!userDisliked) {
    if (!userLiked) {
      post.likes++
      post.likers.push(user.id)
    } else {
      post.likes--
      post.likers = post.likers.filter((id) => id !== user.id)
    }
  } else {
    post.dislikes--
    post.dislikers = post.dislikers.filter((id) => id !== user.id)
    post.likes++
    post.likers.push(user.id)
  }

  await post.save()
  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, {}, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const Dislike = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const user = await User.findById(userId)
  const post = await Post.findById(postId)
  const userLiked = post.likers.includes(user.id)
  const userDisliked = post.dislikers.includes(user.id)
  const message = '✔️ Disliked'

  if (!userLiked) {
    if (!userDisliked) {
      post.dislikes++
      post.dislikers.push(user.id)
    } else {
      post.dislikes--
      post.dislikers = post.dislikers.filter((id) => id !== user.id)
    }
  } else {
    post.likes--
    post.likers = post.likers.filter((id) => id !== user.id)
    post.dislikes++
    post.dislikers.push(user.id)
  }

  await post.save()
  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, types.COMMENT, {}, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const CreateComment = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const { content } = request.body
  const user = await User.findById(userId)
  const post = await Post.findById(postId)
  const comment = new Comment()
  const message = '✔️ Comment left'

  comment.user = user.id
  comment.post = post.id
  comment.content = content
  await comment.save()

  post.comments.push(comment.id)
  await post.save()
  await post.populate([{ path: 'comments', select: 'content' }])

  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, types.COMMENT, types.ID, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const UpdateComment = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const commentId = request.query.id
  const { content } = request.body
  const user = await User.findById(userId)
  const post = await Post.findById(postId)
  const comment = await Comment.findOne({ _id: commentId, user: user.id, post: post.id })
  const message = '✔️ Comment edited'

  comment.content = content
  await comment.save()
  await post.populate([{ path: 'comments', select: 'content' }])

  response.send({ message, post })
}

/**
 * @param {e.Request<types.ID, {}, {}, types.ID, {}>} request
 * @param {e.Response<{}, {}>} response
 * @returns {Promise<void>}
 */

export const DeleteComment = async (request, response) => {
  const userId = request.user.id
  const postId = request.params.id
  const commentId = request.query.id
  const user = await User.findById(userId)
  const post = await Post.findById(postId)
  const comment = await Comment.findOne({ _id: commentId, user: user.id, post: post.id })
  const message = '✔️ Comment deleted'

  post.comments = post.comments.filter((id) => id !== comment.id)
  await comment.remove()
  await post.save()
  await post.populate([{ path: 'comments', select: 'content' }])

  response.send({ message, post })
}
