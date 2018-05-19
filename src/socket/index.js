import SocketIO from 'socket.io'

import chatSock from './chat'
import gameSock from './game'

/**
 *
 * @param {SocketIO.Server} sio
 */
const socketHandler = sio => {
  sio.on('connection', socket => {
    chatSock(sio, socket)
    gameSock(sio, socket)
  })
}

export default socketHandler
