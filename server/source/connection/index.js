import cloudinary from 'cloudinary'
import mongoose from 'mongoose'
import sgMail from '@sendgrid/mail'

import {
  MONGO_DB_NAME,
  MONGO_DB_URI,
  SENDGRID_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} from '#configuration'

import { info, error } from '#utilities'

try {
  sgMail.setApiKey(SENDGRID_API_KEY)

  cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
  })

  await mongoose.connect(MONGO_DB_URI, { dbName: MONGO_DB_NAME })

  info(`Connected to ${MONGO_DB_URI}/${MONGO_DB_NAME}`)
} catch (exception) {
  error(`Something went wrong: ${exception.message}`)
}
