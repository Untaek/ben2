import io from 'socket.io'
import Path from 'path'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import session from 'express-session'
import sharedSession from 'express-socket.io-session'

import router from './src/route'
import socketHandler from './src/socket/index'

const app = express()

app.use(express.static('public'))
app.use(
  session({
    secret: 'asdmvwv9efvsf09sdfffsdf',
    resave: false,
    saveUninitialized: true
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', router)

const server = http.createServer(app)
const sio = io().attach(server)
sio.use(
  sharedSession(session, {
    autoSave: true
  })
)
socketHandler(sio)

server.listen(3000, () => {
  console.log('express server is running: ', 'http://localhost:3000')
})
