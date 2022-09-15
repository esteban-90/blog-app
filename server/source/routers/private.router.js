import { Router } from 'express'
import { categoryController, postController, userController } from '#controllers'
import { fileResizer, fileUploader, /* validator, */ wordFilter } from '#middlewares'

const privateRouter = Router()

privateRouter.get('/me', userController.GetMe)
privateRouter.put('/me', wordFilter, /* validator.forUsers, */ userController.UpdateMe)
privateRouter.put('/me/photo', fileUploader.forPhotos, fileResizer.forPhotos, userController.UploadPhoto)
privateRouter.put('/all-users/:id/follow', userController.Follow)
privateRouter.put('/all-users/:id/unfollow', userController.Unfollow)
privateRouter.delete('/me', userController.DeleteMe)
privateRouter.post('/me/verify', userController.VerifyMeByEmail)
privateRouter.put('/me/verify', userController.VerifyMeByToken)

privateRouter.post('/my-categories', wordFilter, /* validator.forCategories, */ categoryController.Create)
privateRouter.put('/my-categories/:id', wordFilter, /* validator.forCategories, */ categoryController.Update)
privateRouter.delete('/my-categories/:id', categoryController.Delete)

privateRouter.post('/my-posts', wordFilter, /* validator.forPosts, */ postController.Create)
privateRouter.put('/my-posts/:id', wordFilter, /* validator.forPosts, */ postController.Update)
privateRouter.put('/my-posts/:id/image', fileUploader.forImages, fileResizer.forImages, postController.UploadImage)
privateRouter.delete('/my-posts/:id', postController.Delete)
privateRouter.put('/all-posts/:id/like', postController.Like)
privateRouter.put('/all-posts/:id/dislike', postController.Dislike)

privateRouter.post('/all-posts/:id/comment', wordFilter, /* validator.forComments, */ postController.CreateComment)
privateRouter.put('/all-posts/:id/comment', wordFilter, /* validator.forComments, */ postController.UpdateComment)
privateRouter.delete('/all-posts/:id/comment', postController.DeleteComment)

export default privateRouter
