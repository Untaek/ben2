import SocketIO from 'socket.io'
import db from '../db'
import { M, CLASS } from './const'
import { connect } from 'net'
/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
  socket.on(M.ENTER_CHAT, async data => {
    const userID = socket.handshake.session.user.id
    console.log(user.id + user.nickname + user.money)
  })
  socket.on(M.CHAT_MSG, async (user, message) => {
    const id = user.id
    socket.emit(M.CHAT_MSG, user, message)
  })
  socket.on(M.EXIT_CHAT, async data => {
    console.log('EXIT CHAT')
  })
}

export default eventHandler
