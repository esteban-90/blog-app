import e from 'express'
import * as Yup from 'yup'
import * as types from '#types'

/**
 * Creates a function that validates field values
 * @param {object} shape Model shape
 * @returns {(request: e.Request<{}, {}, types.FOR_VALIDATION, {}, {}>, _: e.Response<{}, {}>, next: e.NextFunction) => Promise<void>}
 */

const createValidator = (shape) => {
  return async (request, _, next) => {
    const schema = Yup.object().shape(shape)
    await schema.validate(request.body)
    next()
  }
}

const categoryShape = {
  name: Yup.string()
    .trim()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(10, 'Name must be at most 10 characters long'),
}

const commentShape = {
  content: Yup.string()
    .trim()
    .required('Content is required')
    .min(5, 'Content must be at least 5 characters long')
    .max(40, 'Content must be at most 40 characters long'),
}

const passwordShape = {
  password: Yup.string()
    .trim()
    .required('Password is required')
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,10})/,
      'Password must have at least one lowercase letter, one uppercase letter, one digit, one special character and must be at least eight characters long and at most ten characters long'
    ),

  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
}

const postShape = {
  category: Yup.string().trim().required('Category is required'),

  title: Yup.string()
    .trim()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters long')
    .max(10, 'Title must be at most 10 characters long'),

  content: Yup.string()
    .trim()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters long')
    .max(60, 'Content must be at most 60 characters long'),
}

const userShape = {
  email: Yup.string().trim().required('Email is required').email('Email must be a valid email address'),

  ...passwordShape,

  firstName: Yup.string()
    .trim()
    .required('First Name is required')
    .matches(
      /^[A-Za-z ]{3,10}$/,
      'First name only can have alphabetic characters and spaces and must be at least 3 characters long and at most 10 characters long'
    ),

  lastName: Yup.string()
    .trim()
    .required('Last Name is required')
    .matches(
      /^[A-Za-z ]{4,15}$/,
      'Last name only can have alphabetic characters and spaces and must be at least 4 characters long and at most 15 characters long'
    ),

  biography: Yup.string()
    .notRequired()
    .when({
      /**
       * @param {string} value
       * @returns
       */
      is: (value) => value?.length,
      then: (value) =>
        value
          .min(10, 'Biography must be at least 10 characters long')
          .max(60, 'Biography must be at most 60 characters long'),
    }),
}

const validator = {
  forCategories: createValidator(categoryShape),
  forComments: createValidator(commentShape),
  forPasswords: createValidator(passwordShape),
  forPosts: createValidator(postShape),
  forUsers: createValidator(userShape),
}

export default validator
