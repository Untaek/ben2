import SocketIO from 'socket.io'
import db from '../db'
import { M, CLASS } from './const'
import { connect } from 'net'
/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
  const sql_select_search_joinable = 
  `SELECT room_id, user_id, COUNT(*) FROM
  tbl_participants WHERE room_id BETWEEN 0 AND 4 GROUP BY 
  room_id ORDER BY room_id ASC LIMIT 1`
  const sql_room = 
  `INSERT INTO tbl_games (class) VALUES(?)`
  const sql = 
  `INSERT INTO tbl_participants
  (user_id, room_id) VALUES(?, ?)`
  const sql_leave = 
  `DELETE FROM tbl_participants 
  WHERE user_id=(?) AND room_id=(?)`
  const sql_roomid = 
  `SELECT room_id, COUNT(*) AS roomCount FROM tbl_participants
  WHERE user_id=(?)`
  const sql_roomlist = 
  `DELETE FROM tbl_games WHERE id=(?)`
  const sql_select_get_user_detail = 
  `SELECT nickname FROM tbl_users WHERE id=(?)`

  socket.on(M.ENTER_ROOM, () => {
    const userID = socket.handshake.session.user.id

    if (userID) {
      db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(sql_select_search_joinable, [], (err, result) => {
          if (err) throw err
          const roomID = result.insertId
          connection.query(sql_select_get_user_detail, [], (err ,user)=> {
            const USER = {
              id: userID,
              name: user[0].nickname,
              money: 500,
            }
          })
          socket.join(roomID, err => {
            if (err) throw err
            socket.to(roomID).emit(M.CHAT_MSG, USER)
            socket.emit(M.ENTER_ROOM, USER)
          })
        })
      })
    }
  })
  socket.on(M.CREATE_ROOM, data => {
    const userID = socket.handshake.session.user.id
    const cls = data.class

    console.log(socket.handshake.session.user.id) //
    console.log(cls) //

    if (userID) {
      db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(sql_room, [cls], (err, result) => {
          if (err) throw err
          const roomID = result.insertId //

          connection.query(sql, [userID, roomID], (err, result) => {
            if (err) throw err
            connection.query(sql_select_get_user_detail, [userID, roomID], (err, user) =>{
              const USER = {
                id: userID,
                name: user[0].nickname,
                money: 500,
              }
              console.log(USER.name)
              socket.join(roomID, err => {
                if (err) throw err
                socket.to(roomID).emit(M.CHAT_MSG, USER.name)
                socket.emit(M.ENTER_ROOM, USER)
              })
            })
            
          })
        })
      })
    }
  })
  socket.on(M.EXIT_ROOM, data => {
    const userID = socket.handshake.session.user.id
    db.getConnection((err, connection) => {
      if(err) throw err
      connection.query(sql_roomid, [userID], (err, results) => {
        if(err) throw err
        const roomID = results[0].room_id
        const count = results[0].roomCount
        connection.query(sql_leave, [userID, roomID, count], (err, result)=>{
          if(err) throw err
          console.log('room : ' +roomID+ ' user : '+ userID)
          if(count==1){
            connection.query(sql_roomlist, [roomID], (err, value) => {
              if(err) throw err
              console.log(value)
            })
            socket.leave(roomID, err =>{
              if(err) throw err
              socket.emit(M.EXIT_ROOM, roomID)
            })
          }  
        })
      })
    })
  })
  socket.on('disconnect', (data) => {
    const userID = socket.handshake.session.user.id
    db.getConnection((err, connection) => {
      if(err) throw err
      connection.query(sql_roomid, [userID], (err, results) => {
        if(err) throw err
        const roomID = results[0].room_id
        const count = results[0].roomCount
        connection.query(sql_leave, [userID, roomID, count], (err, result)=>{
          if(err) throw err
          console.log('room : ' +roomID+ ' user : '+ userID)
          if(count==1){
            connection.query(sql_roomlist, [roomID], (err, value) => {
              if(err) throw err
              console.log(value)
            })
            socket.leave(roomID, err =>{
              if(err) throw err
              socket.emit(M.EXIT_ROOM, roomID)
            })
          }  
        })
      })
    })
    console.log(socket.id, ' disconnected')
  })
}

export default eventHandler