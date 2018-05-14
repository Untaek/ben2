import SocketIO from 'socket.io'
import db from '../db'
import { M, CLASS } from './const'
import { connect } from 'net'
/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
  socket.on(M.ENTER_CHAT, ()=> {
    const nickname = socket.handshake.session.user.properties.nickname
    console.log(nickname)
  })
}

export default eventHandler
