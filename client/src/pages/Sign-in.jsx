import { useFormik } from 'formik'
import { useLocation } from 'react-router-dom'
import { useSignInMutation } from '@/api'
import { posterImg, LockIcon, RocketIcon, UserIcon } from '@/assets'
import { ErrorMsg, SubmitBtn, TextInputMd } from '@/components'
import { signInSchema } from '@/validations'

export default function SignIn() {
  const location = useLocation()

  const [
    signIn,

    {
      data: { message = '' } = {},

      // @ts-ignore
      error: { data: { message: error = '' } = {} } = {},

      isError,
      isLoading,
      isSuccess,
    },
  ] = useSignInMutation()

  const {
    handleBlur,
    handleChange,
    handleSubmit,

    values: { email, password },
    touched: { email: emailTouched, password: passwordTouched },
    errors: { email: emailError, password: passwordError },
  } = useFormik({
    // @ts-ignore
    initialValues: { email: String(location.state?.email ?? ''), password: '' },

    async onSubmit(values, { resetForm }) {
      try {
        const payload = await signIn(values).unwrap()
        console.log(payload)
        resetForm()
      } catch {
        return
      }
    },

    validationSchema: signInSchema,
  })

  return (
    <section className='min-h-screen relative py-20 2xl:py-40 bg-gray-900 overflow-hidden'>
      <div className='absolute top-0 left-0 lg:bottom-0 h-full lg:h-auto w-full lg:w-4/12 bg-gray-900 lg:overflow-hidden'>
        <img className='hidden lg:block h-full w-full object-cover' src={posterImg} alt='poster' />
      </div>

      <div className='relative container px-4 mx-auto'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full lg:w-3/5 px-4'>
              <div className='px-6 lg:px-12 py-12 lg:py-24 bg-white shadow-lg rounded-lg'>
                <form onSubmit={handleSubmit}>
                  <h3 className='mb-10 text-2xl font-bold font-heading'>
                    {!isError && !isSuccess ? 'Sign in to your Account' : isSuccess ? message : error}
                  </h3>

                  <TextInputMd
                    icon={<UserIcon />}
                    placeholder='Email'
                    value={email}
                    type='email'
                    changeHandler={handleChange('email')}
                    blurHandler={handleBlur('email')}
                    focus
                    disabled={isLoading || isSuccess}
                  />

                  {emailTouched && <ErrorMsg content={emailError} />}

                  <TextInputMd
                    icon={<LockIcon />}
                    placeholder='Password'
                    value={password}
                    type='password'
                    changeHandler={handleChange('password')}
                    blurHandler={handleBlur('password')}
                    disabled={isLoading || isSuccess}
                  />

                  {passwordTouched && <ErrorMsg content={passwordError} />}

                  <SubmitBtn content={isLoading ? 'Please wait...' : 'Sign in'} disabled={isLoading || isSuccess} />
                </form>
              </div>
            </div>
            <div className='w-full lg:w-2/5 px-4 mb-16 lg:mb-0 order-first lg:order-last'>
              <span className='flex mb-10 mx-auto items-center justify-center h-20 w-20 bg-blue-500 rounded-lg'>
                <RocketIcon />
              </span>

              <h2 className='mb-10 text-center text-6xl lg:text-7xl text-gray-300 font-bold font-heading'>
                Ready to start? Login Now.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
