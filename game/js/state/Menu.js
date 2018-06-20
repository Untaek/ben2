import Player from '../class/Player'
import GameManager from '../class/GameManager'
import Component from '../class/Components'

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

    this.add.text(100, 100, '!!HyperMarble!!', { fontSize: 55 })

    const stat = this.add.group()
    this.add.text(400, 200, `${this.me.name}`, {}, stat)
    this.add.text(400, 250, `$${this.me.money}`, {}, stat)

    Component(this.gameManager).button(100, 200, 'Join a Game', true, () => {
      this.gameManager.controller.findGame()
      console.log('Join a Game')
    })

    Component(this.gameManager).button(100, 300, 'Make a Game', true, () => {
      this.gameManager.controller.createGame()
      console.log('Make a Game')
    })

    console.log('create Menu')
  }
}

export default Menu
