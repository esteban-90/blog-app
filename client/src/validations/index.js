import * as Yup from 'yup'

export const signUpSchema = Yup.object().shape({
  email: Yup.string().trim().required('Email is required').email('Email must be a valid email address'),

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

  password: Yup.string()
    .trim()
    .required('Password is required')
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,10})/,
      'Password must have at least one lowercase letter, one uppercase letter, one digit, one special character and must be at least eight characters long and at most ten characters long'
    ),

  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

export const signInSchema = Yup.object().shape({
  email: Yup.string().trim().required('Email is required').email('Email must be a valid email address'),
  password: Yup.string().trim().required('Password is required'),
})
