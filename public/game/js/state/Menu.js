import Player from '../class/Player'
import GameManager from '../class/GameManager'

class Menu extends Phaser.State {
  constructor(state) {
    super(state)
    /** @type {Player} */
    this.me = null
    /** @type {GameManager} */
    this.gameManager = null
  }
  init(player, gameManager) {
    this.me = player
    this.gameManager = gameManager
  }
  preload() {
    this.game.create.texture('menu', ['C'], 200, 40, 0)
  }
  create() {
    this.game.stage.backgroundColor = '#1eee56'

    this.add.text(100, 100, '!!CoinMabel!!', { fontSize: 55 })

    const stat = this.add.group()
    this.add.text(400, 200, `${this.me.name}`, {}, stat)
    this.add.text(400, 250, `$${this.me.money}`, {}, stat)

    this.button(100, 200, 'Join a Game', 'menu', () => {
      this.gameManager.controller.findGame()
      console.log('Join a Game')
    })

    this.button(100, 300, 'Make a Game', 'menu', () => {
      this.gameManager.controller.createGame()
      console.log('Make a Game')

      this.gameManager.phaser.state.start('Game', true, false, this.gameManager)
    })

    console.log('create Menu')
  }

  //* button template */
  button(x, y, text, key, handler) {
    const startButton_base = this.add.group()

    const startButton = this.game.add.button(
      x,
      y,
      'menu',
      handler,
      this,
      null,
      null,
      null,
      null,
      startButton_base
    )

    const startText = this.add.text(
      x,
      y,
      text,
      { backgroundColor: '#eeeeee' },
      startButton_base
    )
  }
}

export default Menu
