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
    this.dial = null
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
    this.chatter.updatePlayerList()
    this.chatter.addNoticeRow(`${player.name} has joined.`)
  }

  prepareGame(firstPlayerId) {
    this.changeCurrentOrder(firstPlayerId)
    this.currentRoom.turn = 1
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
    /** DEV 재사용 가능하게? NEXT_TURN 메시지 추가로? */
    state_game.button_roll.visible = this.currentRoom.isMyTurn(
      this.controller.me.id
    )
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

  rolledDices(diceValue) {
    this.dices[0].applyValueAndSprite(diceValue[0])
    this.dices[1].applyValueAndSprite(diceValue[1])
  }

  moveMarker(id, position, nextPlayer, turn, currentMoney) {
    const moneys = _
      .chain(currentMoney)
      .keyBy('id')
      .mapValues(v => v.money)
      .value()

    this.currentRoom.players.forEach(player => {
      player.money = moneys[player.id]
      if (id === player.id) {
        player.move(position)
        /** DEV 주사위 던지자마자 다이얼로그 뜨는 문제 */
        if (position != 0 && !this.tiles[position].owner) {
          if (id == this.controller.me.id) {
            this.showDicisionDialog(position)
          }
        }
      }
    })
    this.changeCurrentOrder(nextPlayer, turn)
    /** @type {Game} */
    const state_game = this.phaser.state.getCurrentState()
    /** DEV 재사용 가능하게? NEXT_TURN 메시지 추가로? */
    state_game.button_roll.visible = this.currentRoom.isMyTurn(
      this.controller.me.id
    )
    state_game.turn.setText(`turn: ${turn}`)
  }

  buyTile(id, position, currentMoney) {
    const moneys = _
      .chain(currentMoney)
      .keyBy('id')
      .mapValues(v => v.money)
      .value()

    console.log('moneys', moneys)
    this.currentRoom.players.forEach(player => {
      player.money = moneys[player.id]
      if (player.id === id) {
        this.tiles[position].changeOwner(id)
      }
      this.updateUserStats()
    })
    if (this.dial) {
      this.dial.destroy(true)
    }
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
    console.log('showdial')
    this.dial = Component(this).dicisionDialog(
      'Confirm purchase',
      `Do you wanna buy ${this.tiles[position].name}? \n
       Value: $${this.tiles[position].value}`,
      () => {
        this.controller.buyTile(position)
      },
      function() {
        console.log('nono')
        this.dial.destroy(true)
      },
      true
    )
  }

  changeCurrentOrder(playerID, turn) {
    this.currentRoom.currentOrder = playerID
    this.currentRoom.turn = turn
  }

  endGame(winnerID) {
    const winner = this.currentRoom.players.find(player => {
      return player.id === winnerID
    })

    this.dial = Component(this).dicisionDialog(
      'The game has ended',
      `Congratulation !! \n
      Winner is ${winner.name}!!!`,
      () => {
        this.exitGame()
      },
      null,
      true
    )
  }

  exitGame() {
    this.phaser.state.start('Menu', true, false, this.controller.me, this)
    this.currentRoom = null
    this.chatter.updatePlayerList()
  }
}

export default GameManager
