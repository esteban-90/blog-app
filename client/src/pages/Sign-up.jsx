import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useSignUpMutation } from '@/api'
import { LockIcon, UserIcon } from '@/assets'
import { ErrorMsg, SubmitBtn, TextInputLg } from '@/components'
import { signUpSchema } from '@/validations'

export default function SignUp() {
  const navigate = useNavigate()

  const [
    signUp,

    {
      data: { message = '' } = {},

      // @ts-ignore
      error: { data: { message: error = '' } = {} } = {},

      isError,
      isLoading,
      isSuccess,
    },
  ] = useSignUpMutation()

  const {
    handleBlur,
    handleChange,
    handleSubmit,

    values: { email, firstName, lastName, password, passwordConfirmation },

    touched: {
      email: emailTouched,
      firstName: firstNameTouched,
      lastName: lastNameTouched,
      password: passwordTouched,
      passwordConfirmation: passwordConfirmationTouched,
    },

    errors: {
      email: emailError,
      firstName: firstNameError,
      lastName: lastNameError,
      password: passwordError,
      passwordConfirmation: passwordConfirmationError,
    },
  } = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirmation: '',
    },

    async onSubmit(values, { resetForm }) {
      try {
        const { email } = await signUp(values).unwrap()
        resetForm()
        setTimeout(() => navigate('/sign-in', { state: { email } }), 3_000)
      } catch {
        return
      }
    },

    validationSchema: signUpSchema,
  })

  return (
    <section className='relative py-20 2xl:py-40 bg-gray-800 overflow-hidden'>
      <div className='relative container px-4 mx-auto'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full lg:w-1/2 px-4 mb-16 lg:mb-0'>
              <div className='max-w-md'>
                <span className='text-lg text-blue-400 font-bold'>Register Account</span>

                <h2 className='mt-8 mb-12 text-5xl font-bold font-heading text-white'>
                  Create an account and start pending down your ideas
                </h2>
              </div>
            </div>

            <div className='w-full lg:w-1/2 px-4'>
              <div className='px-6 lg:px-20 py-12 lg:py-24 bg-gray-600 rounded-lg'>
                <form onSubmit={handleSubmit}>
                  <h3 className={`mb-10 text-2xl ${!isError ? 'text-white' : 'text-red-200'} font-bold font-heading`}>
                    {!isError && !isSuccess ? 'Sign Up for Free' : isSuccess ? message : error}
                  </h3>

                  <TextInputLg
                    icon={<UserIcon />}
                    placeholder='First Name'
                    value={firstName}
                    changeHandler={handleChange('firstName')}
                    blurHandler={handleBlur('firstName')}
                    focus
                    disabled={isLoading || isSuccess}
                  />

                  {firstNameTouched && <ErrorMsg content={firstNameError} />}

                  <TextInputLg
                    icon={<UserIcon />}
                    placeholder='Last Name'
                    value={lastName}
                    changeHandler={handleChange('lastName')}
                    blurHandler={handleBlur('lastName')}
                    disabled={isLoading || isSuccess}
                  />

                  {lastNameTouched && <ErrorMsg content={lastNameError} />}

                  <TextInputLg
                    icon={<UserIcon />}
                    type='email'
                    placeholder='example@gmail.com'
                    value={email}
                    changeHandler={handleChange('email')}
                    blurHandler={handleBlur('email')}
                    disabled={isLoading || isSuccess}
                  />

                  {emailTouched && <ErrorMsg content={emailError} />}

                  <TextInputLg
                    icon={<LockIcon />}
                    type='password'
                    placeholder='Password'
                    value={password}
                    changeHandler={handleChange('password')}
                    blurHandler={handleBlur('password')}
                    disabled={isLoading || isSuccess}
                  />

                  {passwordTouched && <ErrorMsg content={passwordError} />}

                  <TextInputLg
                    icon={<LockIcon />}
                    type='password'
                    placeholder='Confirm Password'
                    value={passwordConfirmation}
                    changeHandler={handleChange('passwordConfirmation')}
                    blurHandler={handleBlur('passwordConfirmation')}
                    disabled={isLoading || isSuccess}
                  />

                  {passwordConfirmationTouched && <ErrorMsg content={passwordConfirmationError} />}

                  <div className='inline-flex mb-10' />

                  <SubmitBtn content={isLoading ? 'Please wait...' : 'Sign up'} disabled={isLoading || isSuccess} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
