import Phaser from 'phaser-ce'

import GameManager from './GameManager'
import Player from './Player'

class Marker {
  /** @param {GameMAnager} gameManager */
  constructor(gameManager) {
    /** @type {GameManager} */
    this.gameManager = gameManager
    /** @type {Phaser.Sprite} */
    this.sprite = this.gameManager.phaser.add.sprite(0, 0, 'marker1')
    this.sprite.width = 40
    this.sprite.height = 40
    this.sprite.x = this.gameManager.tiles[0].sprite.x
    this.sprite.y = this.gameManager.tiles[0].sprite.y
    /** @type {Player} */
    this.player = null
    this.position = 0
  }

  changePosition(position) {
    let before = this.position

    this.tween = this.gameManager.phaser.add.tween(this.sprite)
    while (true) {
      this.x = this.gameManager.tiles[before].sprite.x
      this.y = this.gameManager.tiles[before].sprite.y
      this.tween.to({ x: this.x, y: this.y }, 200, 'Quart.easeOut')
      before++
      if (before == this.gameManager.tiles.length) {
        before = 0
      }
      if (before == position) {
        break
      }
    }
    this.tween.start()

    this.position = position
  }
}

export default Marker
