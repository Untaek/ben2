import _ from 'lodash'

import GameManager from './GameManager'
import Player from './Player'

import { M, CODE } from '../const'

class SocketReceiver {
  /**
   * @param {SocketIO.Socket} socket
   * @param {GameManager} gameManager
   */
  constructor(socket, gameManager) {
    this.socket = socket
    this.gameManager = gameManager

    this.startReceiveMessages()
  }

  startReceiveMessages() {
    this.socket.on(M.CONNECT, () => {
      console.log('socket connected')
    })

    this.socket.on(M.FETCH_ME, data => {
      const id = data.id
      const name = data.name
      const money = data.money
      this.gameManager.setMe(id, name, money)
    })

    /**
     * 게임 방 출입 관련 메시지 핸들링
     */
    this.socket.on(M.CREATE_GAME, data => {
      console.log('response', M.CREATE_GAME, data)

      if (data.statusCode == CODE.SUCCESS) {
        this.gameManager.setGameroom()
      } else {
        console.log(M.CREATE_GAME, 'fail', data.statusCode)
      }
    })

    this.socket.on(M.FIND_GAME, data => {
      if (data.statusCode == CODE.SUCCESS) {
        const players = data.players
        const gameID = data.game_id

        this.gameManager.setGameroom(players)
      }
    })

    this.socket.on(M.JOIN_GAME, data => {
      if (data.statusCode == CODE.SUCCESS) {
        this.gameManager.setGameroom()
        this.gameManager.controller.getPlayers()
      }
    })

    this.socket.on(M.EXIT_GAME, data => {})

    this.socket.on(M.ROLL_DICE, data => {
      const id = data.id
      const dice = data
      this.gameManager.rolledDices(1, dice)
      this.gameManager.moveMarker(1, _.random(0, 23, false))
      console.log(data)
      if (data.statusCode == CODE.SUCCESS) {
      }
    })

    this.socket.on(M.MOVE_MARKER, data => {
      const id = data.id
      const position = data.position
      this.gameManager.moveMarker(id, position)
      if (data.statusCode == CODE.SUCCESS) {
      }
    })
  }
}

export default SocketReceiver
