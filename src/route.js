import hapi from 'hapi'
import Mongo from 'mongodb'
import Redis from 'redis'
import _ from 'lodash'
_.mixin(require('lodash-uuid'))

import database from './db'
import { RoomManager } from './room'

/**
 * @type {Mongo.Db}
 */
let db
database.connect().then(d => {
  db = d
  if (d) console.log('mongodb is ready')
})

const redis = Redis.createClient(6379, 'localhost')
const roomManager = new RoomManager()
/**
 * @param {hapi.Request} req
 * @param {hapi.ResponseToolkit} h
 */
const kakaoLogin = async (req, h) => {
  const user = JSON.parse(req.payload)
  console.log(req.payload)

  try {
    const result = await db
      .collection('users')
      .updateOne({ id: user.id }, { $set: user }, { upsert: true })

    const code = result.upsertedCount ? 200 : 304
    return h.response().code(code)
  } catch (e) {
    console.log(e)
  }
}

/**
 * @param {hapi.Request} req
 * @param {hapi.ResponseToolkit} h
 */
const createGame = async (req, h) => {
  const user = JSON.parse(req.payload.user)

  roomManager.createRoom(user.id)
  return h.response().code(201)
}

/**
 * @param {hapi.Request} req
 * @param {hapi.ResponseToolkit} h
 */
const joinGame = async (req, h) => {
  const user = JSON.parse(req.payload.user)

  const joinable = roomManager.roomList.filter(room => {
    return room.isJoinable
  })

  for (let i = 0; i < roomManager.roomList.length; i++) {
    if (roomManager.roomList[i].isJoinable) {
      roomManager.roomList[i].join(user)
      break
    }
  }
}

/**
 * @param {hapi.Request} req
 * @param {hapi.ResponseToolkit} h
 */
const leaveGame = async (req, h) => {
  const user = JSON.parse(req.payload.user)
  const game = req.payload.game

  for (let i = 0; i < roomManager.roomList.length; i++) {
    if (roomManager.roomList[i].roomID === game.roomID) {
      roomManager.roomList[i].leave(user.id)
      break
    }
  }

  return h.response({ game_id: game.id }).code(200)
}

/**
 * @type {hapi.ServerRoute[]}
 */
const route = () => {
  return [
    {
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true
        }
      }
    },
    {
      path: '/auth',
      method: 'post',
      handler: kakaoLogin
    },
    {
      path: '/game/join',
      method: 'post',
      handler: joinGame
    }
  ]
}

export default route
