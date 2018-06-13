import GameManager from './GameManager'

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

    this.socket.on('disconnect', () => {})

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
        console.log(M.FIND_GAME, players)
      }
    })

    this.socket.on(M.JOIN_GAME, data => {
      if (data.statusCode == CODE.SUCCESS) {
        this.gameManager.someoneJoined(data.player)
      }
    })

    this.socket.on(M.START_GAME, data => {
      if (this.gameManager.currentRoom.players.length > 1) {
        this.gameManager.prepareGame()
      } else {
        console.log('must need at least 2 persons')
      }
    })

    this.socket.on(M.EXIT_GAME, data => {
      console.log(data)
    })

    this.socket.on(M.ROLL_DICE, data => {
      const id = data.id
      const dice = data.dice_value
      this.gameManager.rolledDices(dice)
      if (data.statusCode == CODE.SUCCESS) {
        if (data.id == this.gameManager.controller.me.id) {
          this.gameManager.controller.moveMarker()
        }
      }
    })

    this.socket.on(M.MOVE_MARKER, data => {
      if (data.statusCode == CODE.SUCCESS) {
        const id = data.id
        const position = data.position
        this.gameManager.moveMarker(id, position)
        console.log(data)
      }
    })

    this.socket.on(M.BUY_TILE, data => {
      console.log(M.BUY_TILE, data)
      if (data.statusCode == CODE.SUCCESS) {
        const id = data.id
        const position = data.position
        const currentMoney = data.current_money

        this.gameManager.buyTile(id, position, currentMoney)
      }
    })
  }
}

export default SocketReceiver
