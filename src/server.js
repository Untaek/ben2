import io from 'socket.io'
import Path from 'path'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import sharedSession from 'express-socket.io-session'
import connectRedis from 'connect-redis'
import redis from 'redis'

import router from './route'
import socketHandler from './socket/index'

const app = express()
const server = http.createServer(app)
const sio = io(server)

const redisStore = connectRedis(expressSession)
const redisClient = redis.createClient()
redisClient.on('ready', () => {
  redisClient.flushall()
  console.log('redis is ready')
})

const store = new redisStore({ client: redisClient })
const session = expressSession({
  store: store,
  secret: 'asdmvwv9efvsf09sdfffsdf',
  resave: true,
  saveUninitialized: true
})

sio.use(
  sharedSession(session, {
    autoSave: true
  })
)
socketHandler(sio)

app.use(session)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/', router)
app.use(express.static('public'))

export default server
