import { Router } from 'express'
import { categoryController, postController, userController } from '#controllers'
import { /* validator, */ wordFilter } from '#middlewares'

const publicRouter = Router()

publicRouter.post('/sign-up', wordFilter, /* validator.forUsers, */ userController.SignUp)
publicRouter.post('/sign-in', userController.SignIn)
publicRouter.get('/all-users', userController.GetAll)
publicRouter.post('/reset-password', userController.ResetPasswordByEmail)
publicRouter.put('/reset-password', wordFilter, /* validator.forPasswords, */ userController.ResetPasswordByToken)

publicRouter.get('/all-categories', categoryController.GetAll)
publicRouter.get('/all-categories/:id', categoryController.GetOne)

publicRouter.get('/all-posts', postController.GetAll)
publicRouter.get('/all-posts/:id', postController.GetOne)

export default publicRouter
