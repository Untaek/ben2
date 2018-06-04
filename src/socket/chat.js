import SocketIO from 'socket.io'
import db from '../db'
import _ from 'lodash'

import { M, CLASS } from './const'
import { Player, Game, Tile } from './class'
/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 */
const eventHandler = (io, socket) => {
  const sql_select_search_joinable = `SELECT room_id, user_id, COUNT(*) FROM
  tbl_participants WHERE room_id BETWEEN 0 AND 3 GROUP BY 
  room_id ORDER BY room_id ASC LIMIT 1`
  const sql_insert_games = `INSERT INTO tbl_games (class) VALUES(?)`
  const sql_insert_player = `INSERT INTO tbl_participants
  (user_id, room_id) VALUES(?, ?)`
  const sql_delete_player = `DELETE FROM tbl_participants 
  WHERE user_id=(?) AND room_id=(?)`
  const sql_select_get_roomid_count = `SELECT room_id, COUNT(*) AS roomCount FROM tbl_participants
  WHERE user_id=(?)`
  const sql_delete_room = `DELETE FROM tbl_games WHERE id=(?)`
  const sql_select_get_user_detail = `SELECT nickname FROM tbl_users WHERE id=(?)`
  const sql_select_get_user_room = `SELECT user_id FROM tbl_participants WHERE room_id=(?)`
  const sql_select_get_userid = `SELECT user_id FROM tbl_participants WHERE room_id=(?)`
  const sql_select_get_userlist = `SELECT * FROM tbl_users WHERE id=(?)`

  socket.on(M.ENTER_ROOM, async () => {
    const userID = socket.handshake.session.player.id

    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_search_joinable, [])
      const roomID = result.insertId
      const result2 = await db.query(conn, sql_select_get_user_detail, [userID])
      const result3 = await db.query(conn, sql_select_get_user_room, [roomID])

      const player = {
        id: userID,
        name: result2[0].nickname,
        money: 500
      }
      socket.join(roomID, err => {
        if (err) throw err
        socket.to(roomID).emit(M.CHAT_MSG, player, result3)
      })

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
  socket.on(M.CREATE_ROOM, async data => {
    let userID = socket.handshake.session.player.id
    const cls = data.class
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_insert_games, [cls])
      const roomID = result1.insertId
      const result2 = await db.query(conn, sql_insert_player, [userID, roomID])
      const result3 = await db.query(conn, sql_select_get_user_detail, [
        userID,
        roomID
      ])
      const player = {
        id: userID,
        name: result3[0].nickname,
        money: 500,
        position: 0
      }
      const config = {
        class: cls
      }
      socket.join(roomID, err => {
        if (err) throw err
        socket.handshake.session.roomID = roomID
        socket.handshake.session.save()
        //global.gamemanager = new GameManager()
        global.game = new Game()
        game.generate()
        game.init(player)
        //global.dddd = new Player(player)
        socket.emit(M.CREATE_ROOM, { player, config })
      })

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
  socket.on(M.ROLL_DICE, async () => {
    const session = socket.handshake.session
    const dice1 = _.random(1, 6, false)
    const dice2 = _.random(1, 6, false)
    io
      .to(session.roomID)
      .emit(M.ROLL_DICE, { userID: session.userID, dice1, dice2 })
    console.log(dice1, dice2)
    console.log(game.players[0])
  })

  socket.on(M.MOVE_MARKER, async result => {
    const session = socket.handshake.session
    const value = result.dice1 + result.dice2
    console.log('dice_value : ' + value)
    let before = parseInt(game.players[0].marker_position / 24)
    game.players[0].move(value)

    let after = parseInt(game.players[0].marker_position / 24)
    console.log(before + ' : ' + after)

    if (before != after) {
      game.players[0].money += 30
      game.players[0].marker_position = game.players[0].marker_position % 24
    }
    const i = parseInt(game.players[0].marker_position)
    if (game.tiles[i].owner == null) {
      game.buyland({
        position: i,
        id: session.player.id,
        name: session.player.name
      })
    }
    console.log(game.players[0])
    io.to(session.roomID).emit(M.MOVE_MARKER, { userID: session.userID, value })
  })

  socket.on(M.START_GAME, async data => {
    const id = socket.handshake.session.player.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_get_roomid_count, [id])
      const roomID = result1[0].room_id
      const result2 = await db.query(conn, sql_select_get_userid, [roomID])
      const result3 = await db.query(conn, sql_select_get_userlist, [result2])

      socket.emit(M.CHAT_MSG, result3)

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })

  socket.on(M.EXIT_ROOM, async data => {
    const userID = socket.handshake.session.player.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_get_roomid_count, [
        userID
      ])
      const roomID = result1[0].room_id
      const count = result1[0].roomCount
      const result2 = await db.query(conn, sql_delete_player, [
        userID,
        roomID,
        count
      ])

      if (count == 1) {
        socket.leave(roomID, async err => {
          if (err) throw err
          const result3 = await db.query(conn, sql_delete_room, [roomID])
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
    const userID = socket.handshake.session.player.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_get_roomid_count, [
        userID
      ])
      const roomID = result1[0].room_id
      const count = result1[0].roomCount
      const result2 = await db.query(conn, sql_delete_player, [
        userID,
        roomID,
        count
      ])

      if (count == 1) {
        socket.leave(roomID, async err => {
          if (err) throw err
          const result3 = await db.query(conn, sql_delete_room, [roomID])
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
