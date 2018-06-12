import Marker from './Marker'

class Player {
  constructor(player, gameManager) {
    this.id = player.id
    this.name = player.name
    this.firstMoney = player.money
    this.money = player.money
    this.gameManager = gameManager
    this.position = 0
    this.marker = null
  }

  createMarker() {
    this.marker = new Marker(this.gameManager)
  }

  move(position) {
    this.position = position
    this.marker.changePosition(position)
  }

  getIncDecMoney() {
    return this.money - this.firstMoney
  }
}

export default Player
