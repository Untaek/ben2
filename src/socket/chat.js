import SocketIO from 'socket.io'
import db from '../db'
import { M, CLASS } from './const'
import { connect } from 'net'
/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
  const sql_select_search_joinable = `SELECT room_id, user_id, COUNT(*) FROM
  tbl_participants WHERE room_id BETWEEN 0 AND 4 GROUP BY 
  room_id ORDER BY room_id ASC LIMIT 1`
  const sql_room = `INSERT INTO tbl_games (class) VALUES(?)`
  const sql = `INSERT INTO tbl_participants
  (user_id, room_id) VALUES(?, ?)`
  const sql_leave = `DELETE FROM tbl_participants 
  WHERE user_id=(?) AND room_id=(?)`
  const sql_roomid = `SELECT room_id, COUNT(*) AS roomCount FROM tbl_participants
  WHERE user_id=(?)`
  const sql_roomlist = `DELETE FROM tbl_games WHERE id=(?)`
  const sql_select_get_user_detail = `SELECT nickname FROM tbl_users WHERE id=(?)`

  socket.on(M.ENTER_ROOM, async () => {
    const userID = socket.handshake.session.user.id

    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_search_joinable, [])
      const roomID = result.insertId
      const result2 = await db.query(conn, sql_select_get_user_detail, [userID])

      const user = {
        id: userID,
        name: result2[0].nickname,
        money: 500
      }
      socket.join(roomID, err => {
        if (err) throw err
        socket.to(roomID).emit(M.CHAT_MSG, USER)
        socket.emit(M.ENTER_ROOM, USER)
      })

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
  socket.on(M.CREATE_ROOM, async data => {
    const userID = socket.handshake.session.user.id
    const cls = data.class
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_room, [cls])
      const roomID = result.insertId
      const result2 = await db.query(conn, sql, [userID, roomID])
      const result3 = await db.query(conn, sql_select_get_user_detail, [
        userID,
        roomID
      ])
      const user = {
        id: userID,
        name: result3[0].nickname,
        money: 500
      }
      socket.join(roomID, err => {
        if (err) throw err
        socket.to(roomID).emit(M.CHAT_MSG, USER.name)
        socket.emit(M.ENTER_ROOM, USER)
      })

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
  socket.on(M.EXIT_ROOM, async data => {
    const userID = socket.handshake.session.user.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_roomid, [userID])
      const roomID = result1[0].room_id
      const count = result1[0].roomCount
      const result2 = await db.query(conn, sql_leave, [userID, roomID, count])

      if (count == 1) {
        socket.leave(roomID, err => {
          if (err) throw err
          socket.emit(M.EXIT_ROOM, roomID)
        })
      }
      console.log(socket.id, ' disconnected')
      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
  socket.on('disconnect', async data => {
    const userID = socket.handshake.session.user.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_roomid, [userID])
      const roomID = result1[0].room_id
      const count = result1[0].roomCount
      const result2 = await db.query(conn, sql_leave, [userID, roomID, count])

      if (count == 1) {
        socket.leave(roomID, err => {
          if (err) throw err
          socket.emit(M.EXIT_ROOM, roomID)
        })
      }
      console.log(socket.id, ' disconnected')
      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
}

export default eventHandler
