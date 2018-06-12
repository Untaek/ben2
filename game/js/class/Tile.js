import Phaser from 'phaser-ce'

import GameManager from './GameManager'
import Player from './Player'

class Tile {
  constructor(name, value, position, gameManager) {
    this.name = name
    this.value = value
    this.position = position
    /** @type {GameManager} */
    this.gameManager = gameManager
    /** @type {Player} */
    this.owner = null
    /** @type {Player[]} */
    this.visitor = []
    /** @type {Phaser.Sprite} */
    this.sprite = null
    /** @type {Phaser.Text} */
    this.ownerSigniture = undefined
  }

  /** @param {number} id */
  changeOwner(id) {
    this.owner = this.gameManager.currentRoom.players.find(
      player => player.id === id
    )
    if (!id) {
      this.ownerSigniture.destroy()
      return
    }
    if (this.ownerSigniture == undefined) {
      this.ownerSigniture = this.sprite.game.add.text(
        this.sprite.x,
        this.sprite.y,
        `${this.owner.name}`,
        { fill: '#ffffff' }
      )
    } else {
      this.ownerSigniture.text = `${this.owner.name}`
    }
  }
}

export default Tile
