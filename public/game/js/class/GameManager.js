import io from 'socket.io-client'
import _ from 'lodash'

import SocketReceiver from './SocketReceiver'
import Controller from './Controller'
import Menu from '../state/Menu'
import Game from '../state/Game'
import Gameroom from './Gameroom'

import Dice from './Dice'
import Tile from './Tile'
import PlayerStat from './PlayerStat'

class GameManager {
  /** @param {Phaser.Game} phaser */
  constructor(phaser) {
    /** @type {Gameroom} */
    this.currentRoom = null
    /** @type {Dice[]} */
    this.dices = []
    /** @type {Tile[]} */
    this.tiles = []
    /** @type {PlayerStat[]} */
    this.playerStats = []
    this.phaser = phaser
    this.socket = io({ host: 'localhost', port: 3000 })
    this.socketMessageReceiver = new SocketReceiver(this.socket, this)
    this.controller = new Controller(this.socket)
    this.phaser.state.add('Menu', Menu)
    this.phaser.state.add('Game', Game)

    this.controller.fetchMe()
  }

  /**
   * @param {Player} player
   */
  setMe(player) {
    this.controller.me = player
    this.phaser.state.start('Menu', true, false, player, this)
  }

  /**
   * @param {Player[]} players
   */
  setGameroom(players) {
    this.currentRoom = new Gameroom()
    this.currentRoom.players = [this.controller.me]
    if (players) {
      players.forEach(p => {
        this.currentRoom.pushPlayer(p)
      })
    }

    console.log(this.currentRoom.players)

    this.phaser.state.start('Game', true, false, this)
  }

  updateUserStats() {
    this.playerStats.forEach((stat, i) => {
      if (this.currentRoom.players.length > i) {
        stat.updatePlayer(this.currentRoom.players[i])
      } else {
        stat.updatePlayer(undefined)
      }
    })
    console.log(this.playerStats)
  }
}

export default GameManager
