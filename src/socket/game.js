import SocketIO from 'socket.io'
import db from '../db'
import _ from 'lodash'

import { M, CODE } from './const'
import { Player, Game, Tile, Gamemanager, gamemanager } from './class'
/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 */

const eventHandler = (io, socket) => {
  const sql_select_search_joinable = `
    SELECT room_id, COUNT(*)
    FROM tbl_participants 
    GROUP BY room_id 
    ASC HAVING COUNT(*)<4 LIMIT 1
  `
  const sql_insert_games = `INSERT INTO tbl_games (id, create_date) VALUES(?, null)`
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
  const sql_select_find_players = `SELECT user_id FROM tbl_participants WHERE room_id=(?)`
  const sql_select_get_players = `SELECT * FROM tbl_users WHERE id=(1)`

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
      db.release(conn)
    } catch (e) {
      console.log(e)
    }
  })
  socket.on(M.FIND_GAME, async () => {
    const userID = socket.handshake.session.player.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_search_joinable, [])
      const roomID = result1[0].room_id
      const result2 = await db.query(conn, sql_select_find_players, [roomID])
      const result3 = await db.query(conn, sql_select_get_players, [
        result2[0].user_id
      ])
      const result4 = await db.query(conn, sql_select_get_user_detail, [userID])
      const result5 = await db.query(conn, sql_insert_player, [userID, roomID])
      const player = {
        id: userID,
        name: result4[0].nickname,
        money: result4[0].money,
        position: 0
      }

      console.log(result3)
      socket.join(roomID, err => {
        if (err) throw err
        socket.handshake.session.roomID = roomID
        socket.handshake.session.save()
        console.log(gamemanager)
        gamemanager.games.get(roomID).join(player)
        console.log(gamemanager.games.get(roomID))
        //global.game = new Game()
        //game.generate()
        //game.init(player)
        //global.dddd = new Player(player)
      })
      socket.emit(M.FIND_GAME, { players: result3, statusCode: CODE.SUCCESS })
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
        money: 1000
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
    const userID = socket.handshake.session.player.id

    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_insert_games, [userID])
      const roomID = userID
      const result2 = await db.query(conn, sql_insert_player, [userID, roomID])
      const result3 = await db.query(conn, sql_select_get_user_detail, [
        userID,
        roomID
      ])
      console.log(JSON.stringify(result3))
      const player = {
        id: userID,
        name: result3[0].nickname,
        position: 0,
        key: roomID
      }
      socket.join(roomID, err => {
        if (err) throw err
        socket.handshake.session.roomID = roomID
        socket.handshake.session.save()

        gamemanager.createGame(player)
        gamemanager.games.get(roomID).generate()
        gamemanager.games.get(roomID).join(player)
        gamemanager.games.get(roomID)
        //console.log(gamemanager.games.get(roomID))
        console.log(gamemanager.games.get(2))
        console.log(gamemanager.games.get(1))
        console.log(gamemanager.games)
        //global.game = new Game()
        //game.generate()
        //game.init(player)
        //global.dddd = new Player(player)
        socket.emit(M.CREATE_GAME, { statusCode: CODE.SUCCESS })
      })
      console.log('SUCCESS')
      console.log(JSON.stringify(gamemanager))
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
      id: session.player.id,
      dice_value: [dice1, dice2],
      statusCode: CODE.SUCCESS
    })
    gamemanager.games.get(session.roomID).rolldice(dice1 + dice2)
    const games = gamemanager.games.get(session.roomID)
    console.log(dice1, dice2)
    console.log(games.players.get(session.player.id).marker_position)
  })

  socket.on(M.MOVE_MARKER, async () => {
    const session = socket.handshake.session
    const dice = gamemanager.games.get(session.roomID).dice
    console.log('dice_value : ' + dice)
    let before = parseInt(
      gamemanager.games.get(session.roomID).players.get(session.player.id)
        .marker_position / 24
    )
    gamemanager.games
      .get(session.roomID)
      .players.get(session.player.id)
      .move(parseInt(dice))

    let after = parseInt(
      gamemanager.games.get(session.roomID).players.get(session.player.id)
        .marker_position / 24
    )
    console.log(before + ' : ' + after)

    if (before != after) {
      gamemanager.games
        .get(session.roomID)
        .players.get(session.player.id).money += 30
      gamemanager.games
        .get(session.roomID)
        .players.get(session.player.id).marker_position =
        gamemanager.games.get(session.roomID).players.get(session.player.id)
          .marker_position % 24
    }
    const i = parseInt(
      gamemanager.games.get(session.roomID).players.get(session.player.id)
        .marker_position
    )
    /**/ if (gamemanager.games.get(session.roomID).tiles[i].owner == null) {
      gamemanager.games.get(session.roomID).buyland({
        position: i,
        id: session.player.id,
        name: session.player.nam,
        value: gamemanager.games.get(session.roomID).tiles[i].value
      })
    }
    console.log(
      gamemanager.games.get(session.roomID).players.get(session.player.id)
    )
    io.to(session.roomID).emit(M.MOVE_MARKER, {
      id: session.player.id,
      position: gamemanager.games
        .get(session.roomID)
        .players.get(session.player.id).marker_position,
      statusCode: CODE.SUCCESS
    })
  })

  socket.on(M.BUY_TILE, async () => {
    const session = socket.handshake.session
    const player = socket.handshake.session.player

    const i = parseInt(
      gamemanager.games.get(session.roomID).players.get(session.player.id)
        .marker_position
    )
    gamemanager.games.get(session.roomID).buyland({
      position: i,
      id: player.id,
      value: gamemanager.games.get(session.roomID).tiles[i].value,
      money: gamemanager.games
        .get(session.roomID)
        .players.get(session.player.id).money
    })
    io.to(session.roomID).emit(M.BUY_TILE, {
      statusCode: CODE.SUCCESS,
      id: player.id,
      position: i,
      current_money: [...{ id: number, money: number }]
    })
  })

  socket.on(M.SELL_TILE, async () => {
    const player = socket.handshake.session.player
    const i = parseInt(
      gamemanager.games.get(session.roomID).players.get(session.player.id)
        .marker_position
    )
    gamemanager.games.get(session.roomID).selltile({
      position: i,
      id: player.id,
      value: gamemanager.games.get(session.roomID).tiles[i].value,
      money: gamemanager.games
        .get(session.roomID)
        .players.get(session.player.id).money
    })
    io.to(session.roomID).emit(M.SELL_TILE, {
      statusCode: CODE.SUCCESS,
      id: player.id,
      position: i,
      current_money: [...{ id: number, money: number }]
    })
  })

  socket.on(M.PAY_FEE, async () => {
    const player = socket.handshake.session.player
  })

  socket.on(M.START_GAME, async data => {
    const id = socket.handshake.session.player.id
    try {
      const conn = await db.getPool()
      const result1 = await db.query(conn, sql_select_get_roomid_count, [id])
      const roomID = result1[0].room_id
      const result2 = await db.query(conn, sql_select_get_userid, [roomID])
      const result3 = await db.query(conn, sql_select_get_userlist, [result2])

      io.to(roomID).emit(M.START_GAME, { statusCode: CODE.SUCCESS })

      db.release(conn)
    } catch (e) {
      console.log(e)
    }
    console.log('GAME START')
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
