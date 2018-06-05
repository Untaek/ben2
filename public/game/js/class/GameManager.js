import io from 'socket.io-client'
import _ from 'lodash'

import SocketReceiver from './SocketReceiver'
import Controller from './Controller'
import Menu from '../state/Menu'
import Game from '../state/Game'

import Dice from './Dice'
import Tile from './Tile'
import PlayerStat from './PlayerStat'

class GameManager {
  /** @param {Phaser.Game} phaser */
  constructor(phaser) {
    this.currentRoom = null
    this.dices = []
    this.tiles = []
    this.playerStats = []
    this.board = null
    this.phaser = phaser
    this.socket = io({ host: 'localhost', port: 3000 })
    this.socketMessageReceiver = new SocketReceiver(this.socket, this)
    this.controller = new Controller(this.socket)
    this.phaser.state.add('Menu', Menu)
    this.phaser.state.add('Game', Game)

    this.controller.fetchMe()

    /* dev
    this.setMe({
      id: 1234,
      name: 'untaek',
      money: 50000
    })
    */
  }

  /**
   * @param {Player} player
   */
  setMe(player) {
    this.controller.me = player
    this.phaser.state.start('Menu', true, false, player, this)
    console.log(player)
  }

  generate() {
    console.log('generate')
    this.dices.push(new Dice(100, 200, this))
    this.dices.push(new Dice(200, 200, this))
    this.tiles = [
      new Tile('start', 0, 0),
      new Tile('PIVX', 10, 1),
      new Tile('Digibyte', 12, 2),
      new Tile('Dogecoin', 14, 3),
      new Tile('Qtum', 22, 4),
      new Tile('Verge', 32, 5),
      new Tile('Zenash', 36, 6),
      new Tile('Monacoin', 36, 7),
      new Tile('Golem', 36, 8),
      new Tile('Status', 36, 9),
      new Tile('Steem', 36, 10),
      new Tile('OmiseGO', 36, 11),
      new Tile('Zcash', 36, 12),
      new Tile('Dash', 36, 13),
      new Tile('NEO', 36, 14),
      new Tile('TRON', 36, 15),
      new Tile('ADA', 36, 16),
      new Tile('Litecoin', 36, 17),
      new Tile('EOS', 36, 18),
      new Tile('Bitcoin Cash', 36, 19),
      new Tile('Ripple', 36, 20),
      new Tile('Etherium', 36, 21),
      new Tile('Bitcoin', 36, 22),
      new Tile('Cash', 36, 23)
    ]

    let that = this

    const boardX = 30
    const boardY = 30
    const boardWidth = this.phaser.world.width - boardY * 2
    const boardHeight = this.phaser.world.height - boardX * 2

    const board_base = this.phaser.add.group()
    this.board = board_base.create(boardX, boardY, 'board')
    this.board.width = boardWidth
    this.board.height = boardHeight

    this.statX = boardX + boardWidth / 7.0
    this.statY = boardY + boardHeight / 7.0

    for (let i = 0; i < 7; i++) {
      const width = boardWidth / 7.0
      const height = boardHeight / 7.0
      const cellTop = board_base.create(boardX + i * width, boardY, 'cell')
      const cellBot = board_base.create(
        boardX + i * width,
        boardHeight + boardY - boardHeight / 7.0,
        'cell'
      )
      const cellLeft = board_base.create(boardX, boardY + i * height, 'cell')
      const cellRight = board_base.create(
        boardWidth - width + boardX,
        boardY + i * height,
        'cell'
      )

      cellTop.width = width
      cellTop.height = height
      cellBot.width = width
      cellBot.height = height
      cellRight.width = width
      cellRight.height = height
      cellLeft.width = width
      cellLeft.height = height
    }

    this.tiles.map((tile, i) => {
      if (i < 6) {
        this.phaser.add.text(
          boardX,
          (boardHeight / 7.0) * (7 - i),
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else if (i < 12) {
        this.phaser.add.text(
          (boardWidth / 7.0) * (i - 6) + boardX,
          boardY,
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else if (i < 18) {
        this.phaser.add.text(
          boardWidth,
          (boardHeight / 7.0) * (i - 11),
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else {
        this.phaser.add.text(
          (boardWidth / 7.0) * (24 - i) + boardX,
          boardHeight,
          tile.name,
          { fontSize: 12 },
          board_base
        )
      }
    })

    _.times(4, function(num) {
      const stat = new PlayerStat(that, num)
      that.playerStats.push(stat)
    })
  }

  setGameroom() {
    this.currentRoom = new Gameroom()
  }
}

export default GameManager
