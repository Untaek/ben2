import io from 'socket.io-client'
import $ from 'jquery'

import SocketReceiver from './SocketReceiver'
import Controller from './Controller'
import Menu from '../state/Menu'
import Game from '../state/Game'
import Gameroom from './Gameroom'
import Player from './Player'
import Chatter from './Chatter'
import Component from './Components'

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
    this.chatter = new Chatter(this)
    this.phaser.state.add('Menu', Menu)
    this.phaser.state.add('Game', Game)

    this.controller.fetchMe()
  }

  /**
   * @param {Player} player
   */
  setMe(id, name, money) {
    this.controller.me = new Player({ id, name, money }, this)
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
        this.currentRoom.pushPlayer(new Player(p, this))
      })
    }

    this.chatter.updatePlayerList()
    this.currentRoom.players.forEach(player => {
      this.chatter.addNoticeRow(`${player.name} has joined.`)
    })

    console.log(this.currentRoom.players)

    this.phaser.state.start('Game', true, false, this)
  }

  someoneJoined(player) {
    this.currentRoom.pushPlayer(new Player(player, this))
    this.updateUserStats()
    this.chatter.addNoticeRow(`${player.name} has joined.`)
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
    this.dices[0].applyValueAndSprite(diceValue[0])
    this.dices[1].applyValueAndSprite(diceValue[1])
  }

  moveMarker(id, position) {
    this.currentRoom.players.forEach(player => {
      if (id === player.id) {
        player.move(position)
        /** DEV */
        if (position != 0 && !this.tiles[position].owner)
          this.showDicisionDialog(position)
      }
    })
  }

  buyTile(id, position, currentMoney) {
    const moneys = _
      .chain(currentMoney)
      .keyBy('id')
      .mapValues(v => v.money)
      .value()
    this.currentRoom.players.forEach(player => {
      player.money = moneys['id']
      if (player.id === id) {
        this.tiles[position].changeOwner(id)
      }
      this.updateUserStats()
    })
  }

  sellTile(id, position, currentMoney) {
    const moneys = _
      .chain(currentMoney)
      .keyBy('id')
      .mapValues(v => v.money)
      .value()
    this.currentRoom.players.forEach(player => {
      player.money = moneys['id']
      if (player.id === id) {
        this.tiles[position].changeOwner()
      }
      this.updateUserStats()
    })
  }

  payFee(id, position, currentMoney) {
    const moneys = _
      .chain(currentMoney)
      .keyBy('id')
      .mapValues(v => v.money)
      .value()
    this.currentRoom.players.forEach(player => {
      player.money = moneys['id']
      this.updateUserStats()
    })
  }

  showDicisionDialog(position) {
    const c = Component(this).dicisionDialog(
      '구매확인',
      `Do you wanna buy ${this.tiles[position].name}? \n
       Value: $${this.tiles[position].value}`,
      () => {
        this.controller.buyTile(position)
        /** DEV */
        this.tiles[position].changeOwner(1)
        console.log('okok')
        c.destroy(true)
      },
      () => {
        console.log('nono')
        c.destroy(true)
      },
      true
    )
  }
}

export default GameManager
