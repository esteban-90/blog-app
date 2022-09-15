import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API = createApi({
  reducerPath: 'BlogAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),

  endpoints(builder) {
    return {
      signUp: builder.mutation({
        /**
         * @param {object} request
         * @param {string} request.email
         * @param {string} request.password
         * @param {string} request.passwordConfirmation
         * @param {string} request.firstName
         * @param {string} request.lastName
         */

        query(request) {
          return {
            url: '/sign-up',
            body: request,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        },

        /**
         * @param {object} response
         * @param {string} response.message
         * @param {string} response.email
         */

        transformResponse(response) {
          return response
        },
      }),

      signIn: builder.mutation({
        /**
         * @param {object} request
         * @param {string} request.email
         * @param {string} request.password
         */

        query(request) {
          return {
            url: '/sign-in',
            body: request,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        },

        /**
         * @param {object} response
         * @param {string} response.message
         * @param {string} response.accessToken
         */

        transformResponse(response) {
          return response
        },
      }),
    }
  },
})

export const { useSignUpMutation, useSignInMutation, reducerPath, reducer, middleware } = API
