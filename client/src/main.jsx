import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import '@/index.css'
import App from '@/App'
import store from '@/store'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <Provider store={store} children={<App />} />
  </StrictMode>
)
