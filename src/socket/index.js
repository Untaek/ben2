import SocketIO from 'socket.io'

import chatSock from './chat'
import gameSock from './game'

/**
 *
 * @param {SocketIO.Server} sio
 */
const socketHandler = sio => {
  sio.on('connection', socket => {
    socket.join()
    chatSock(socket)
    gameSock(socket)
  })
}

export default socketHandler
