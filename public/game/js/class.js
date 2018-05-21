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

  buyLand(position) {
    this.gameManager.tiles[position].changeOwner(this.id)
    this.spendMoney(this.gameManager.tiles[position].value)
  }

  spendMoney(value) {}
  earnMoney(value) {}
}

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

class GameManager {
  /**
   * @param {Phaser.Game} game
   */
  constructor(game) {
    this.game = game
    this.me = null
    this.players = []
    this.config = {
      category: 'individual'
    }
    this.tiles = tiles
    this.dices = []
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
        if (result.player) {
          this.enterPlayer(result.player)
        } else {
          console.log(M.ENTER_ROOM, 'fail')
        }
      })
      .on(M.EXIT_ROOM, result => {
        console.log(M.EXIT_ROOM, result)
        leftUser(user)
      })
      .on(M.ROLL_DICE, result => {
        console.log(result)
        this.printDices(result.dice1, result.dice2)
      })
  }

  generate() {
    this.dices = [new Dice(160, 300, this.game), new Dice(260, 300, this.game)]
    this.players.map(player => {})
  }

  init(host, config) {
    this.game.state.start('Game')
    this.players = [new Player(host, this)]
    this.config = config

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
    this.socket.emit(M.ROLL_DICE)
  }

  printDices(val1, val2) {
    this.dices[0].applyValueAndSprite(val1)
    this.dices[1].applyValueAndSprite(val2)
  }

  enterPlayer() {
    this.players = [...this.players, new Player(result.player)]
  }
}

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
