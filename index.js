import Hapi from 'hapi'
import inert from 'inert'
import io from 'socket.io'
import Path from 'path'

import router from './src/route'
import socketHandler from './src/socket/index'

const serverOptions = {
  port: 3000,
  host: 'localhost',
  routes: { files: { relativeTo: Path.join(__dirname, 'public') } }
}
const server = new Hapi.Server(serverOptions)

const init = async () => {
  socketHandler(io(server.listener))
  await server.register(inert)
  await server.route(router())
  await server.start()
  console.log('Server is running ', server.info.uri)
}

init()
