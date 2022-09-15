import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '#app'
import { API_URL, TEST_EMAIL } from '#configuration'
import { User } from '#models'
import { capitalizeWords } from '#utilities'

const api = supertest(app)

describe('API tests', () => {
  describe('Public routes', () => {
    describe('User controller', () => {
      const signUpRoute = `${API_URL}/sign-up`
      const signInRoute = `${API_URL}/sign-in`
      const allUsersRoute = `${API_URL}/all-users`
      const passwordResetRoute = `${API_URL}/reset-password`

      const initialValues = {
        email: TEST_EMAIL,
        password: 'Testing90*',
        passwordConfirmation: 'Testing90*',
        firstName: 'tester',
        lastName: 'user',
      }

      beforeEach(async () => {
        await User.deleteMany({})
      })

      describe('Sign up', () => {
        let values = { ...initialValues }

        it('should create a new user with correct values', async () => {
          const { body, statusCode } = await api.post(signUpRoute).send(values)
          const { message, email } = body

          expect(statusCode).toBe(201)
          expect(message).toBe('✔️ You have successfully signed up')
          expect(email).toBe(values.email)
        })

        it('should not create a new user if email already exists', async () => {
          await api.post(signUpRoute).send(values)

          const { body, statusCode } = await api.post(signUpRoute).send(values)
          const { name, message, user } = body

          expect(statusCode).toBe(400)
          expect(name).toBe('ValidationError')
          expect(message).toContain(`Email ${values.email} already exists.`)
          expect(user).toBeUndefined()
        })

        it('should not create a new user if password confirmation is wrong', async () => {
          values.passwordConfirmation = 'Testing91*'

          const { body, statusCode } = await api.post(signUpRoute).send(values)
          const { name, message, user } = body

          expect(statusCode).toBe(400)
          expect(name).toBe('ValidationError')
          expect(message).toContain('Passwords must match')
          expect(user).toBeUndefined()
        })

        describe('should not create a new user if uses profane words', () => {
          for (const field in values) {
            it(`in the field ${field}`, async () => {
              values[field] = 'this shit should not pass'

              const { body, statusCode } = await api.post(signUpRoute).send(values)
              const { name, message } = body

              expect(statusCode).toBe(400)
              expect(name).toBe('ValidationError')
              expect(message).toContain("Please, don't use profane words")
            })
          }
        })

        // describe('should not create a new user if does not provide a required value', () => {
        //   for (const field in values) {
        //     it(`in the field ${field}`, async () => {
        //       values[field] = ' '

        //       const { body, statusCode } = await api.post(signUpRoute).send(values)
        //       const { name, message } = body
        //       const _field = field.startsWith('pass') ? 'Passwords must match' : `${splitWords(field)} is required`

        //       expect(statusCode).toBe(400)
        //       expect(name).toBe('ValidationError')
        //       expect(message).toContain(_field)
        //     })
        //   }
        // })

        // describe('should not create a new user if does not provide a valid value', () => {
        //   const invalidValues = {
        //     email: 'testexample.com',
        //     password: 'Testing90',
        //     passwordConfirmation: 'Testing90',
        //     firstName: 'tester1',
        //     lastName: 'user1',
        //   }

        //   for (const field in values) {
        //     it(`in the field ${field}`, async () => {
        //       values[field] = invalidValues[field]

        //       const { body, statusCode } = await api.post(signUpRoute).send(values)
        //       const { name } = body

        //       expect(statusCode).toBe(400)
        //       expect(name).toBe('ValidationError')
        //     })
        //   }
        // })

        afterEach(() => {
          values = { ...initialValues }
        })
      })

      describe('Sign in', () => {
        const values = { email: initialValues.email, password: initialValues.password }

        beforeEach(async () => {
          await api.post(signUpRoute).send(initialValues)
        })

        it('should succeed with correct data', async () => {
          const { body, statusCode } = await api.post(signInRoute).send(values)
          const { message, accessToken } = body
          const fullName = capitalizeWords(`${initialValues.firstName} ${initialValues.lastName}`)

          expect(statusCode).toBe(200)
          expect(message).toBe(`✔️ Hi ${fullName}, you have successfully signed in`)
          expect(accessToken).toBeDefined()
        })

        it('should fail if password is wrong', async () => {
          values.password = 'Testing91*'

          const { body, statusCode } = await api.post(signInRoute).send(values)
          const { name, message } = body

          expect(statusCode).toBe(401)
          expect(name).toBe('UnauthorizedError')
          expect(message).toBe('Wrong password')
        })
      })

      describe('Get all', () => {
        it('should get all registered users', async () => {
          const newValues = [
            initialValues,
            { ...initialValues, email: 'test@example.com' },
            { ...initialValues, email: 'test2@example.com' },
            { ...initialValues, email: 'test3@example.com' },
          ]

          for (const values of newValues) await api.post(signUpRoute).send(values)

          const { body, statusCode } = await api.get(allUsersRoute)
          const { message, users } = body

          expect(statusCode).toBe(200)
          expect(message).toBe('✔️ All users')
          expect(users).toHaveLength(newValues.length)
        })
      })

      describe('Reset password by email', () => {
        it('should send successfully an email to reset password', async () => {
          await api.post(signUpRoute).send(initialValues)

          const { body, statusCode } = await api.post(passwordResetRoute).send({ email: initialValues.email })
          const user = await User.findOne({ email: initialValues.email })
          const { message } = body

          expect(statusCode).toBe(200)
          expect(message).toBe('✔️ Reset token sent')
          expect(user.passwordResetTokenHash).toBeDefined()
          expect(user.passwordResetTokenExpiry).toBeInstanceOf(Date)
        })
      })

      describe('Reset password by token', () => {
        beforeEach(async () => {
          await api.post(signUpRoute).send(initialValues)
          await api.post(passwordResetRoute).send({ email: initialValues.email })
        })

        // it('should reset password successfully if it is valid', async () => {
        //   const validPswd = 'Testing92*'
        //   const user = await User.findOne({ email: initialValues.email })
        //   const token = user.passwordResetTokenHash
        //   const { body, statusCode } = await api.put(passwordResetRoute).query({ token }).send({ password: validPswd })
        //   const { message, user: _user } = body

        //   expect(statusCode).toBe(200)
        //   expect(message).toBe('✔️ Password reset')
        //   expect(_user.passwordResetTokenHash).toBeUndefined()
        //   expect(_user.passwordResetTokenExpiry).toBeUndefined()
        // })

        it('should not reset password if it contains profane words', async () => {
          const invalidPswd = 'shit'
          const user = await User.findOne({ email: initialValues.email })
          const token = user.passwordResetTokenHash
          const { body, statusCode } = await api
            .put(passwordResetRoute)
            .query({ token })
            .send({ password: invalidPswd })
          const { message, user: _user } = body

          expect(statusCode).toBe(400)
          expect(message).toBe("Please, don't use profane words")
        })

        // it('should not reset password if it is invalid', async () => {
        //   const invalidPswd = 'Testing*'
        //   const user = await User.findOne({ email: initialValues.email })
        //   const token = user.passwordResetTokenHash
        //   const { body, statusCode } = await api
        //     .put(passwordResetRoute)
        //     .query({ token })
        //     .send({ password: invalidPswd })
        //   const { name, message } = body

        //   expect(statusCode).toBe(400)
        //   expect(name).toBe('ValidationError')
        //   expect(message).toContain('Password must have at least one lowercase letter,')
        // })
      })
    })
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
