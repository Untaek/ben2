import SocketIO from 'socket.io'
import db from '../db'
/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
  const sql_search = `SELECT room_id, user_id, COUNT(*) FROM
     participants WHERE room_id BETWEEN 0 AND 4 GROUP BY 
     room_id ORDER BY room_id ASC LIMIT 1`
  const sql_room = `INSERT INTO tbl_games (class) VALUES(?)`
  const sql = `INSERT INTO tbl_participants
    (user_id, room_id) VALUES(?, ?)`
  const sql_leave = `DELETE FROM tbl_participants WHERE user_id=1`
  const sql_foreign = `ALTER TABLE `
  socket.on('joingame', () => {
    const userID = socket.handshake.session.user.id

    if (userID) {
      db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(sql_search, [], (err, result) => {
          if (err) throw err
          const roomID = result.insertId
          socket.join(roomID, err => {
            if (err) throw err
            socket.emit('joingame', roomID)
          })
        })
      })
    }
  })
  socket.on('createroom', data => {
    const userID = socket.handshake.session.user.id
    const cls = data.class
    console.log(socket.handshake.session.user.id) //
    console.log(cls) //
    if (userID) {
      db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(sql_room, [cls], (err, result) => {
          if (err) throw err
          console.log(result)
          const roomID = result.insertId //

          connection.query(sql, [userID, roomID], (err, result) => {
            if (err) throw err

            socket.join(roomID, err => {
              if (err) throw err
              socket.emit('joingame', roomID)
            })
          })
        })
      })
    }
  })
  socket.on('exitroom', () => {
    db.getConnection((err, connection) => {
      if (err) throw err
      connection.query(sql_leave, [], (err, result) => {})
    })
  })

  socket.on('disconnect', () => {
    console.log(socket.id, ' disconnected')
  })
}

export default eventHandler
