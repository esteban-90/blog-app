import mongoose from 'mongoose'
import { createNotFoundError } from '#utilities'

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    post: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },

  { timestamps: true, versionKey: false }
)

commentSchema.set('toJSON', {
  virtuals: true,

  transform(_, comment) {
    delete comment._id
  },
})

commentSchema.post(/^find/, (comment) => {
  if (!comment) {
    const error = createNotFoundError('Comment not found')
    throw error
  }
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
