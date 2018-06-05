//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

class Marker {
  /**
   *
   * @param {string} image
   * @param {GameManager} gameManager
   */
  constructor(image, gameManager) {
    this.gameManager = gameManager
    this.sprite = this.gameManager.game.add.sprite(0, 0, image)
    this.sprite.height = 40
    this.sprite.width = 40
    this.position = 0
  }

  move(position) {
    this.position = position
    this.sprite.x = position
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

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
    /**
     * @type {Marker}
     */
    this.marker = null
  }

  createMarker(image) {
    this.marker = new Marker(image, this.gameManager)
  }

  buyLand(position) {
    this.gameManager.tiles[position].changeOwner(this.id)
    this.spendMoney(this.gameManager.tiles[position].value)
  }

  spendMoney(value) {}
  earnMoney(value) {}
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

class Dice {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y, game) {
    /**
     * @type {Phaser.Game}
     */
    this.game = game
    this.x = x
    this.y = y
    this.value = 0
    this.keys = ['dice1', 'dice2', 'dice3', 'dice4', 'dice5', 'dice6']
    this.sprite = null
    this.init()
    console.log('dice object created')
  }

  init() {
    this.sprite = this.game.add.sprite(this.x, this.y, '')
    this.sprite.scale.setTo(0.3, 0.3)

    if (this.sprite) {
      console.log('dice sprite is created')
    } else {
      console.log('dice sprite create fail')
    }
  }

  applyValueAndSprite(val) {
    this.value = val
    this.sprite.loadTexture(this.keys[this.value - 1])
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

class PlayerStat {
  /**
   * @param {GameManager} gameManager
   */
  constructor(gameManager, index) {
    /**
     * @type {GameManager}
     */
    this.gameManager = gameManager
    /**
     * @type {Phaser.Group}
     */
    this.sprite = null
    /**
     * @type {Player}
     */
    this.player = null
    this.state = null
    this.nameText = null
    this.moneyText = null
    this.moneyIncDec = null
    this.image = null
    this.index = index
  }

  generate() {
    const game = this.gameManager.game
    const index = this.index
    const baseX = this.gameManager.statX
    const baseY = this.gameManager.statY
    this.sprite = game.add.group()
    this.sprite.x = Math.floor(index / 2) * (game.world.centerX - baseX) + baseX
    this.sprite.y =
      Math.floor(index % 2) * (game.world.centerY - baseY - 50) + baseY

    const x = this.sprite.x
    const y = this.sprite.y

    this.image = game.add.sprite(0, 0, 'marker1', 0, this.sprite)
    this.image.width = 80
    this.image.height = 80
    this.image.visible = false
    this.nameText = game.add.text(this.image.width, 0, ``, {}, this.sprite)
    this.moneyText = game.add.text(
      this.image.width,
      0 + 30,
      ``,
      {},
      this.sprite
    )
    this.moneyIncDec = game.add.text(
      this.image.width,
      0 + 60,
      ``,
      {},
      this.sprite
    )
  }

  /**
   * @param {Player} player
   */
  setPlayer(player) {
    this.player = player
    this.image.visible = true
    this.nameText.setText(player.name)
    this.moneyText.setText(`$${player.money}`)
    this.moneyIncDec.setText(`+$0`)
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

class GameManagera {
  /**
   * @param {Phaser.Game} game
   */
  constructor(game) {
    this.game = game
    this.board_base = null
    this.statX = 0
    this.statY = 0
    this.me = null
    /**
     * @type {Player[]}
     */
    this.players = []
    this.config = {
      category: 'individual'
    }
    this.tiles = tiles
    this.dices = []
    this.playerStats = []
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
        if (typeof result === Array) {
          this.enterPlayer(result)
        } else {
          console.log(M.ENTER_ROOM, 'fail')
        }
      })
      .on(M.EXIT_ROOM, result => {
        console.log(M.EXIT_ROOM, result)
      })
      .on(M.ROLL_DICE, result => {
        console.log(M.ROLL_DICE, result)
        this.printDices(result.dice1, result.dice2)
      })
  }

  init(host, config) {
    this.game.state.start('Game')
    //this.players = [new Player(host, this)]
    this.config = config

    console.log('room created', host)
  }

  printDices(val1, val2) {
    this.dices[0].applyValueAndSprite(val1)
    this.dices[1].applyValueAndSprite(val2)
  }

  enterPlayer(players) {
    console.log('enterPlayer', players)
    this.players = this.players
    this.players.map(player, i => {
      this.playerStats[i].setPlayer(player)
    })
  }

  generate() {
    const game = this.game
    let that = this

    const boardX = 30
    const boardY = 30
    const boardWidth = game.world.width - boardY * 2
    const boardHeight = game.world.height - boardX * 2

    const board_base = this.game.add.group()
    const board = board_base.create(boardX, boardY, 'board')
    board.width = boardWidth
    board.height = boardHeight

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
        game.add.text(
          boardX,
          boardHeight / 7.0 * (7 - i),
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else if (i < 12) {
        game.add.text(
          boardWidth / 7.0 * (i - 6) + boardX,
          boardY,
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else if (i < 18) {
        game.add.text(
          boardWidth,
          boardHeight / 7.0 * (i - 11),
          tile.name,
          { fontSize: 12 },
          board_base
        )
      } else {
        game.add.text(
          boardWidth / 7.0 * (24 - i) + boardX,
          boardHeight,
          tile.name,
          { fontSize: 12 },
          board_base
        )
      }
    })

    this.dices = [new Dice(460, 400, this.game), new Dice(560, 400, this.game)]

    _.times(4, function(num) {
      const stat = new PlayerStat(that, num)
      stat.generate()
      that.playerStats.push(stat)
    })
    this.players.map((player, i) => {
      player.marker = new Marker('marker1', this)
      this.playerStats[i].setPlayer(player)
    })
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

class Chatter {
  /**
   * @param {GameManager} gameManager
   * @param {JQuery<HTMLElement>} container
   */
  constructor(gameManager, container) {
    this.gameManager = gameManager
    this.container = container
    this.socket = gameManager.socket
    this.$playerList = this.container.children('#list-user')
    this.$chatContent = this.container.children('#content')
    this.$sender = this.container.children('#sender')

    this.$sender.on('keydown', 'input', function(e) {
      if (e.keyCode == 13 && $('#sender > input').val().length > 0) {
        $('#sender > button').click()
      }
    })

    this.$sender.on('click' || 'keydown', 'button', function() {
      const $input = $('#sender > input')
      gameManager.socket.emit(M.CHAT_MSG, $input.val())
      $input.val('')
    })

    this.socket.on(M.CHAT_MSG, obj => {
      console.log(obj)
      this.addChatRow(obj.name, obj.message)
    })

    this.socket.on(M.CREATE_ROOM || M.ENTER_ROOM, obj => {
      this.joinedPlayer(obj.player)
    })
  }

  /*************************************************
   * Deal a Dynamical layout                       *
   *************************************************/
  addNoticeRow(message) {
    this.$chatContent.append(`<li>${message}</li>`)
  }

  addChatRow(sender, message) {
    if (sender) {
      this.$chatContent.append(`<li>${sender}: ${message}</li>`)
    }
  }

  updatePlayerList() {
    this.$playerList.html('')
    this.gameManager.players.forEach(player => {
      this.$playerList.append(this.playerListRow(player))
    })
  }

  joinedPlayer(player) {
    console.log(player)
    this.updatePlayerList()
    this.addNoticeRow(`${player.name} has joined.`)
  }

  leftPlayer(player) {
    this.updateUserList()
    this.addNoticeRow(`${player.name} has lefted.`)
  }

  playerListRow(player) {
    return `
      <li>${player.name}</li>
    `
  }
}

const tiles = [
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
