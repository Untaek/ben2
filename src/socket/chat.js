import SocketIO from 'socket.io'
import db from '../db'
import _ from 'lodash'

import { M, CODE } from './const'
import { Player, Game, Tile, Gamemanager } from './class'
/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 */
const eventHandler = (io, socket) => {
  const sql_select_search_joinable = `SELECT room_id, user_id, COUNT(*) FROM
  tbl_participants WHERE room_id BETWEEN 0 AND 3 GROUP BY 
  room_id ORDER BY room_id ASC LIMIT 1`
  const sql_insert_games = `INSERT INTO tbl_games VALUES(null, null)`
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
  const sql_select_get_me = `SELECT * FROM tbl_users WHERE id=(?)`

  socket.on(M.FETCH_ME, async () => {
    const me = socket.handshake.session.player.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_get_me, [me])
      socket.emit(M.FETCH_ME, {
        id: result1[0].id,
        name: result1[0].nickname,
        money: result1[0].money
      })

      console.log('WHAT' + JSON.stringify(result1))
      console.log(result1[0].id)

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })

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
  socket.on(M.CREATE_GAME, async data => {
    let userID = socket.handshake.session.player.id

    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_insert_games, [])
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
      socket.join(roomID, err => {
        if (err) throw err
        socket.handshake.session.roomID = roomID
        socket.handshake.session.save()

        global.gamemanager = new Gamemanager()
        gamemanager.generate()
        gamemanager.createGame(player)
        gamemanager.games[0].join(player)
        //global.game = new Game()
        //game.generate()
        //game.init(player)
        console.log(gamemanager)
        //global.dddd = new Player(player)
        socket.emit(M.CREATE_ROOM, { state: CODE.SUCCESS })
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
    io.to(session.roomID).emit(M.ROLL_DICE, {
      userID: session.userID,
      dice1,
      dice2
    })
    console.log(dice1, dice2)
    console.log(gamemanager.games[0].players[0])
  })

  socket.on(M.MOVE_MARKER, async result => {
    const session = socket.handshake.session
    const value = result.dice1 + result.dice2
    console.log('dice_value : ' + value)
    let before = parseInt(gamemanager.games[0].players[0].marker_position / 24)
    gamemanager.games[0].players[0].move(value)

    let after = parseInt(gamemanager.games[0].players[0].marker_position / 24)
    console.log(before + ' : ' + after)

    if (before != after) {
      gamemanager.games[0].players[0].money += 30
      gamemanager.games[0].players[0].marker_position =
        gamemanager.games[0].players[0].marker_position % 24
    }
    const i = parseInt(gamemanager.games[0].players[0].marker_position)
    if (gamemanager.games[0].tiles[i].owner == null) {
      gamemanager.games[0].buyland({
        position: i,
        id: session.player.id,
        name: session.player.name
      })
    }
    console.log(gamemanager.games[0].players[0])
    io.to(session.roomID).emit(M.MOVE_MARKER, {
      userID: session.userID,
      position: gamemanager.games[0].players[0].marker_position
    })
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
