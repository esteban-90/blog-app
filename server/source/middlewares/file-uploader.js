import multer from 'multer'

/**
 * Creates a function that uploads a file as buffer in memory
 * @param {('image' | 'photo')} fieldName Name of the field from where the file is uploaded
 * @returns
 */

const createFileUploader = (fieldName) => {
  return multer({
    storage: multer.memoryStorage(),

    fileFilter(_, file, callback) {
      if (file.mimetype.startsWith('image')) callback(null, true)
      else callback(null, false)
    },

    limits: { fileSize: 1_000_000 },
  }).single(fieldName)
}

const fileUploader = {
  forImages: createFileUploader('image'),
  forPhotos: createFileUploader('photo'),
}

export default fileUploader
