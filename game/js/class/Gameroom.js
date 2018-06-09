import _ from 'lodash'

import Player from './Player'
import GameManager from './GameManager'

class Gameroom {
  /** @param {GameManager} gameManager */
  constructor(gameManager) {
    /** @type {GameManager} */
    this.gameManager = gameManager
    /** @type {Player[]} */
    this.players = []
    this.config = null
    this.state = 0
    this.turn = 0
  }

  /** @param {Player} player */
  pushPlayer(player) {
    this.players.push(player)
  }

  /** @param {Player} player */
  removePlayer(player) {
    const id = player.id
    this.players = this.players.filter(player => {
      return id != player.id
    })
  }
}

export default Gameroom
