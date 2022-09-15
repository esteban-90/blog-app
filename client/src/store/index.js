import { configureStore } from '@reduxjs/toolkit'
import { reducerPath, reducer, middleware } from '@/api'

const store = configureStore({
  reducer: { [reducerPath]: reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
})

export default store
