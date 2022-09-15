import { expressjwt } from 'express-jwt'
import { API_URL, JWT_SECRET } from '#configuration'

const userAuthenticator = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user',
}).unless({
  path: new RegExp(`${API_URL}/(?!account.*)`),
})

export default userAuthenticator
