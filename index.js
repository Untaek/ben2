import Hapi from 'hapi'
import inert from 'inert'

import router from './src/route'

const serverOptions = { port: 3000, host: '0.0.0.0' }
const server = new Hapi.Server(serverOptions)

const init = async () => {
  await server.register(inert)
  await server.route(router())
  await server.start()
  console.log('Server is running ', server.info.uri)
}

init()
