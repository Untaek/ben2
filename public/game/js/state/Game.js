import GameManager from '../class/GameManager'

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
    this.gameManager.generate()
    this.gameManager.updateUserStats()
  }
}

export default Game
