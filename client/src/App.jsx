import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, SignIn, SignUp } from '@/pages'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
      </Routes>
    </Router>
  )
}
