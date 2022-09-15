import e from 'express'
import path from 'path'
import sharp from 'sharp'
import uniqid from 'uniqid'

/**
 * Creates a function that resizes a file sent in the request
 * @param {(500 | 250)} size The size of the output file
 * @returns {(request: e.Request<{}, {}, {}, {}, {}>, _: e.Response<{}, {}>, next: e.NextFunction) => Promise<void>} The resizer function
 */

const createFileResizer = (size) => {
  return async (request, _, next) => {
    const { buffer, originalname } = request.file
    const fileName = uniqid('', `-${originalname}`)
    const filePath = path.join(`source/assets/${fileName}`)

    request.file.path = filePath

    await sharp(buffer).resize(size, size).toFormat('jpeg').jpeg({ quality: 90 }).toFile(filePath)
    next()
  }
}

const fileResizer = {
  forImages: createFileResizer(500),
  forPhotos: createFileResizer(250),
}

export default fileResizer
