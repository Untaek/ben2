import io from 'socket.io-client'
import jquery from 'jquery'

import SocketReceiver from './SocketReceiver'
import Controller from './Controller'
import Menu from '../state/Menu'
import Game from '../state/Game'
import Gameroom from './Gameroom'
import Player from './Player'
import Chatter from './Chatter'

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
    this.chatter = new Chatter(this, jquery('#chat'))
    this.phaser.state.add('Menu', Menu)
    this.phaser.state.add('Game', Game)

    this.controller.fetchMe()
  }

  /**
   * @param {Player} player
   */
  setMe(id, name, money) {
    this.controller.me = new Player(id, name, money, this)
    this.phaser.state.start('Menu', true, false, this.controller.me, this)
  }

  /**
   * @param {Player[]} players
   */
  setGameroom(players) {
    this.currentRoom = new Gameroom()
    this.currentRoom.players = [this.controller.me]
    if (players) {
      players.forEach(p => {
        this.currentRoom.pushPlayer(new Player(p.id, p.name, p.money, this))
      })
    }

    console.log(this.currentRoom.players)

    this.phaser.state.start('Game', true, false, this)
  }

  prepareGame() {
    this.currentRoom.players.forEach(player => {
      player.createMarker()
      this.startGame()
    })
  }

  startGame() {
    /** @type {Game} */
    const state_game = this.phaser.state.getCurrentState()
    state_game.button_start.visible = false
    state_game.button_leave.visible = false
    state_game.button_roll.visible = true
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

  rolledDices(id, diceValue) {
    this.dices[0].applyValueAndSprite(diceValue.dice1)
    this.dices[1].applyValueAndSprite(diceValue.dice2)
  }

  moveMarker(id, position) {
    this.currentRoom.players.forEach(player => {
      if (id === player.id) {
        player.move(position)
      }
    })
  }
}

export default GameManager
