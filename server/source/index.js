import http from 'http'
import app from '#app'
import { PORT } from '#configuration'
import { info } from '#utilities'

const server = http.createServer(app)

server.listen(PORT, () => {
  info(`Server is running on http://localhost:${PORT}`)
})
