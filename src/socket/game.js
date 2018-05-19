import SocketIO from 'socket.io'
import db from '../db'
import { M, CLASS } from './const'
import { connect } from 'net'
/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 */
const eventHandler = (io, socket) => {
  socket.on(M.ENTER_CHAT, async data => {
    const userID = socket.handshake.session.user.id
    console.log(user.id + user.nickname + user.money)
  })
  socket.on(M.CHAT_MSG, async message => {
    const user = socket.handshake.session.user
    const roomID = socket.handshake.session.roomID
    if (roomID) io.to(roomID).emit(M.CHAT_MSG, { name: user.name, message })
  })
  socket.on(M.EXIT_CHAT, async data => {
    console.log('EXIT CHAT')
  })
}

export default eventHandler
