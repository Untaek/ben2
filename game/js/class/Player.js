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
    this.picture_url = player.picture_url
  }

  createMarker() {
    this.marker = new Marker(this.gameManager, this)
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
