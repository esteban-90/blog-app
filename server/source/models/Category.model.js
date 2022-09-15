import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { createNotFoundError } from '#utilities'

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true,
    },
  },

  { timestamps: true, versionKey: false }
)

categorySchema.set('toJSON', {
  virtuals: true,

  transform(_, category) {
    delete category._id
  },
})

categorySchema.plugin(uniqueValidator, { message: 'Category {VALUE} already exists' })

categorySchema.post(/^find/, (category) => {
  if (!category) {
    const error = createNotFoundError('Category not found')
    throw error
  }
})

const Category = mongoose.model('Category', categorySchema)

export default Category
