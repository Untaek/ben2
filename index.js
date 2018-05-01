import Hapi from 'hapi'
import inert from 'inert'
import io from 'socket.io'
import Path from 'path'

import router from './src/route'

const serverOptions = {
  port: 3000,
  host: 'localhost',
  routes: { files: { relativeTo: Path.join(__dirname, 'public') } }
}
const server = new Hapi.Server(serverOptions)

const init = async () => {
  await server.register(inert)
  await server.route(router())
  await server.start()
  console.log('Server is running ', server.info.uri)
}

const socketio = io(server.listener)
socketio.on('connection', socket => {
  console.log('connected')
})

init()
