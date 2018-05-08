import SocketIO from 'socket.io'

/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
  socket.on('createroom', () => {
    console.log(socket.handshake.session)
  })
}

export default eventHandler
