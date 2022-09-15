import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { createNotFoundError } from '#utilities'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    passwordResetTokenHash: {
      type: String,
    },

    passwordResetTokenExpiry: {
      type: Date,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    biography: {
      type: String,
      default: '',
    },

    photo: {
      type: String,
      default: 'https://res.cloudinary.com/devm5dl9j/image/upload/v1661460211/isxloil5ztnffmv9j17m.jpg',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationTokenHash: {
      type: String,
    },

    verificationTokenExpiry: {
      type: Date,
    },

    followers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    following: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    posts: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Post',
        },
      ],
    },
  },

  { timestamps: true, versionKey: false }
)

userSchema.virtual('fullName').get(function () {
  const fullName = `${this.firstName} ${this.lastName}`
  return fullName
})

userSchema.set('toJSON', {
  virtuals: true,

  transform(_, user) {
    delete user._id
    delete user.passwordHash
    delete user.createdAt
    delete user.updatedAt
  },
})

userSchema.plugin(uniqueValidator, { message: 'Email {VALUE} already exists.' })

userSchema.post(/^find/, (user) => {
  if (!user) {
    const error = createNotFoundError('User not found')
    throw error
  }
})

const User = mongoose.model('User', userSchema)

export default User
