import _ from 'lodash'

import GameManager from '../class/GameManager'

import Dice from '../class/Dice'
import Tile from '../class/Tile'
import PlayerStat from '../class/PlayerStat'

class Game extends Phaser.State {
  constructor(state) {
    super(state)
    /** @type {GameManager} */
    this.gameManager = null
  }

  init(gameManager) {
    this.gameManager = gameManager
  }

  preload() {
    this.load.image('board', 'wood4.png')
    this.load.image('cell', 'box.png')
    for (let i = 1; i <= 6; i++) this.load.image(`dice${i}`, `dice${i}.png`)
    this.load.image('marker1', 'marker1.jpg')
  }

  create() {
    this.game.stage.backgroundColor = '#80dfff'
    this.gameManager.tiles = [
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

    const boardX = 30
    const boardY = 30
    const centerX = this.game.world.width / 2
    const centerY = this.game.world.height / 2
    const boardWidth = this.game.world.width - boardY * 2
    const boardHeight = this.game.world.height - boardX * 2
    const board_base = this.game.add.group()

    /**
     * board base
     */
    this.board = board_base.create(boardX, boardY, 'board')
    this.board.width = boardWidth
    this.board.height = boardHeight
    for (let i = 0; i < 7; i++) {
      const width = boardWidth / 7.0
      const height = boardHeight / 7.0
      const cellTop = board_base.create(boardX + i * width, boardY, 'cell')
      const cellBot = board_base.create(
        boardX + boardWidth - width * (i + 1),
        boardHeight + boardY - boardHeight / 7.0,
        'cell'
      )
      const cellLeft = board_base.create(
        boardX,
        boardY + boardHeight - i * height - height,
        'cell'
      )
      const cellRight = board_base.create(
        boardWidth - width + boardX,
        boardY + i * height,
        'cell'
      )

      cellTop.width = cellBot.width = cellRight.width = cellLeft.width = width
      cellTop.height = cellBot.height = cellRight.height = cellLeft.height = height

      this.gameManager.tiles[i].sprite = cellLeft
      this.gameManager.tiles[i + 6].sprite = cellTop
      this.gameManager.tiles[i + 12].sprite = cellRight
      if (i < 6) this.gameManager.tiles[i + 18].sprite = cellBot
    }

    /**
     * tiles
     */
    this.gameManager.tiles.map((tile, i) => {
      if (i < 6) {
        this.game.add.text(
          boardX,
          (boardHeight / 7.0) * (7 - i),
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else if (i < 12) {
        this.game.add.text(
          (boardWidth / 7.0) * (i - 6) + boardX,
          boardY,
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else if (i < 18) {
        this.game.add.text(
          boardWidth,
          (boardHeight / 7.0) * (i - 11),
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else {
        this.game.add.text(
          (boardWidth / 7.0) * (24 - i) + boardX,
          boardHeight,
          tile.name,
          { fontSize: 12 },
          board_base
        )
      }
    })

    /**
     * dices
     */
    this.gameManager.dices.push(new Dice(450, 400, this.gameManager))
    this.gameManager.dices.push(new Dice(550, 400, this.gameManager))

    /**
     * players status
     */
    _.times(4, num => {
      const stat = new PlayerStat(this.gameManager, num)
      this.gameManager.playerStats.push(stat)
    })
    this.gameManager.updateUserStats()

    /**
     * buttons
     */
    this.button_leave = this.button(
      centerX - 250,
      centerY + 130,
      'Leave',
      true,
      () => {
        this.gameManager.controller.exitGame()
      }
    )
    this.button_start = this.button(
      centerX + 50,
      centerY + 130,
      'Start',
      true,
      () => {
        /** DEV */
        this.gameManager.prepareGame()
        if (this.gameManager.currentRoom.players.length > 1) {
          this.gameManager.controller.startGame()
        } else {
          console.log('must need at least 2 persons')
        }
      }
    )
    this.button_roll = this.button(
      centerX - 200,
      centerY + 100,
      'Roll dices',
      false,
      () => {
        this.gameManager.controller.rollDice()
      }
    )
  }

  button(x, y, text, visible, callback) {
    const button = this.game.add.group()
    this.game.add.button(
      x,
      y,
      'menu',
      callback,
      this,
      null,
      null,
      null,
      null,
      button
    )

    this.game.add.text(
      x,
      y,
      text,
      {
        fill: '#ffffff'
      },
      button
    )
    button.visible = visible
    return button
  }
}

export default Game
