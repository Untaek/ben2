import GameManager from './GameManager'

class Dice {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {GameManager} gameManager
   */
  constructor(x, y, gameManager) {
    console.log(x, y)
    this.value = 0
    this.x = x
    this.y = y
    this.gameManager = gameManager
    this.keys = ['dice1', 'dice2', 'dice3', 'dice4', 'dice5', 'dice6']
    this.sprite = this.gameManager.phaser.add.sprite(this.x, this.y, '')
    this.sprite.scale.setTo(0.3, 0.3)
  }

  applyValueAndSprite(val) {
    this.value = val
    this.sprite.loadTexture(this.keys[this.value - 1])
  }
}

export default Dice
