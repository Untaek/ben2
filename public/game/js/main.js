const parent = document.getElementById('game')

const config = {
  renderer: Phaser.CANVAS,
  width: 800,
  height: 600,
  antialias: true,
  parent: parent
}

const game = new Phaser.Game(config)

let board_base
/**
 * @type {GameManager}
 */
let gameManager

class GameManager {
  constructor() {
    this.me = null
    this.players = []
    this.config = {
      category: 'individual'
    }
    this.tiles = [
      new Tile('start', 0, 0),
      new Tile('a', 10, 1),
      new Tile('b', 12, 2),
      new Tile('c', 14, 3),
      new Tile('d', 22, 4),
      new Tile('e', 32, 5),
      new Tile('f', 36, 6),
      new Tile('g', 36, 7),
      new Tile('h', 36, 8),
      new Tile('i', 36, 9),
      new Tile('j', 36, 10),
      new Tile('k', 36, 11),
      new Tile('l', 36, 12),
      new Tile('m', 36, 13),
      new Tile('n', 36, 14),
      new Tile('o', 36, 15),
      new Tile('p', 36, 16),
      new Tile('q', 36, 17),
      new Tile('r', 36, 18),
      new Tile('s', 36, 19),
      new Tile('t', 36, 20),
      new Tile('u', 36, 21),
      new Tile('v', 36, 22),
      new Tile('w', 36, 23)
    ]
    this.dices = [new Dice(100, 200), new Dice(200, 200)]
    this.socket = socketHandler.socket
    this.socket
      .on(M.CONNECT, result => {
        console.log('socket connected')
      })
      .on(M.CREATE_ROOM, result => {
        console.log(M.CREATE_ROOM, result)
        this.init(result.player, result.config)
      })
      .on(M.ENTER_ROOM, result => {
        console.log(M.ENTER_ROOM, result)
        this.players = [...this.players, new Player(result.player)]
      })
      .on(M.EXIT_ROOM, result => {
        console.log(M.EXIT_ROOM, result)
        leftUser(user)
      })
      .on(M.CHAT_MSG, result => {
        console.log(M.CHAT_MSG, result)
        //addChatRow(result.sender, result.message)
      })
      .on(M.ROLL_DICE, result => {
        console.log(result)
        this.printDices(result.dice1, result.dice2)
      })
  }

  init(host, config) {
    this.players = [new Player(host, this)]
    this.config = config
    game.state.start('Game')
    console.log('room created', host)
  }

  createRoom() {
    this.socket.emit(M.CREATE_ROOM, { class: 'team' })
  }

  enterRoom() {
    this.socket.emit(M.ENTER_ROOM)
  }

  start() {
    this.socket.emit(M.START_GAME)
  }

  rollDice() {
    console.log('roll')
    this.socket.emit(M.ROLL_DICE)
  }

  printDices(val1, val2) {
    this.dices[0].applyValueAndSprite(val1)
    this.dices[1].applyValueAndSprite(val2)
  }
}

class Player {
  /**
   * @param {object} player
   * @param {GameManager} gameManager
   */
  constructor(player, gameManager) {
    this.name = player.name
    this.money = player.money
    this.id = player.id
    this.gameManager = gameManager
    this.marker = new Marker('marker1')
  }

  rollDice(dice) {
    dice.roll()
  }

  buyLand(position) {
    this.gameManager.tiles[position].changeOwner(this.id)
    this.spendMoney(this.gameManager.tiles[position].value)
  }

  spendMoney(value) {}
  earnMoney(value) {}
}

class Marker {
  constructor(image) {
    this.sprite = game.add.sprite(0, 0, image)
    this.sprite.height = 40
    this.sprite.width = 40
    this.position = 0
  }

  move(position) {
    this.position = position
    this.sprite.x = position
  }
}

class Dice {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.value = 0
    this.sprite = game.add.sprite(x, y)
    this.sprite.scale.setTo(0.3, 0.3)
  }

  applyValueAndSprite(val) {
    this.value = val
    this.sprite.loadTexture(`dice${val}`)
  }
}

class Tile {
  /**
   *
   * @param {string} name
   * @param {number} value
   * @param {number} position
   */
  constructor(name, value, position) {
    this.name = name
    this.value = value
    this.position = position
    this.owner = null
    this.x = 100
    this.y = 100
  }

  changeOwner(playerId) {
    this.owner = playerId
  }
}

const Game = {
  preload: () => {
    game.load.image('board', 'wood4.png')
    game.load.image('cell', 'box.png')
    for (let i = 1; i < 6; i++) game.load.image(`dice${i}`, `dice${i}.png`)
    game.create.texture('btn', ['B'], 200, 100, 0)
    game.load.image('marker1', 'marker1.jpg')
  },

  create: () => {
    game.stage.backgroundColor = '#80dfff'

    const boardX = 30
    const boardY = 30
    const boardWidth = game.world.width - boardY * 2
    const boardHeight = game.world.height - boardX * 2

    board_base = game.add.group()
    const board = board_base.create(boardX, boardY, 'board')
    board.width = boardWidth
    board.height = boardHeight

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

    button(150, 440, 'roll a dice', 'btn', () => {
      gameManager.rollDice()
    })

    gameManager.tiles.map((tile, i) => {
      if (i < 6) {
        game.add.text(
          boardX,
          boardHeight / 7.0 * (7 - i),
          tile.name,
          {},
          board_base
        )
      } else if (i < 12) {
        game.add.text(
          boardWidth / 7.0 * (i - 6) + boardX,
          boardY,
          tile.name,
          {},
          board_base
        )
      } else if (i < 18) {
        game.add.text(
          boardWidth,
          boardHeight / 7.0 * (i - 11),
          tile.name,
          {},
          board_base
        )
      } else {
        game.add.text(
          boardWidth / 7.0 * (24 - i) + boardX,
          boardHeight,
          tile.name,
          {},
          board_base
        )
      }
    })
  },

  update: () => {}
}

game.state.add('Menu', Menu)
game.state.add('Game', Game)
game.state.start('Menu')
