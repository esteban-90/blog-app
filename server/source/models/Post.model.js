import mongoose from 'mongoose'
import { createNotFoundError } from '#utilities'

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: 'https://res.cloudinary.com/devm5dl9j/image/upload/v1661460568/me88io2mwscxk2grn7ew.jpg',
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    likers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    dislikes: {
      type: Number,
      default: 0,
    },

    dislikers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    comments: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Comment',
        },
      ],
    },
  },

  { timestamps: true, versionKey: false }
)

postSchema.set('toJSON', {
  virtuals: true,

  transform(_, post) {
    delete post._id
  },
})

postSchema.post(/^find/, (post) => {
  if (!post) {
    const error = createNotFoundError('Post not found')
    throw error
  }
})

const Post = mongoose.model('Post', postSchema)

export default Post
