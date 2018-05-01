import hapi from 'hapi'
import Mongo from 'mongodb'
import Redis from 'redis'
import _ from 'lodash'
_.mixin(require('lodash-uuid'))

import express from 'express'

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

const roomManager = new RoomManager()

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const kakaoLogin = async (req, res) => {
  console.log(req.body)
  const user = req.body

  try {
    const result = await db
      .collection('users')
      .updateOne({ id: user.id }, { $set: user }, { upsert: true })

    req.session.userID = user.id
    res.redirect('http://localhost:3000/main.html')
  } catch (e) {
    console.log(e)
  }
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const createGame = async (req, res) => {
  const user = JSON.parse(req.body.user)

  roomManager.createRoom(user.id)
  res.status(201)
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const joinGame = async (req, res) => {
  const user = JSON.parse(req.body.user)

  const joinable = roomManager.roomList.filter(room => {
    return room.isJoinable
  })

  for (let i = 0; i < roomManager.roomList.length; i++) {
    if (roomManager.roomList[i].isJoinable) {
      roomManager.roomList[i].join(user)
      break
    }
  }

  res.json({ id: user.id })
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const leaveGame = async (req, res) => {
  const user = JSON.parse(req.payload.user)
  const game = req.payload.game

  for (let i = 0; i < roomManager.roomList.length; i++) {
    if (roomManager.roomList[i].roomID === game.roomID) {
      roomManager.roomList[i].leave(user.id)
      break
    }
  }

  res.json({ game_id: game.id })
}

const router = express.Router()
router.post('/auth', kakaoLogin)
router.post('/game', joinGame)

export default router
