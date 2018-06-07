import Marker from './Marker'

class Player {
  constructor(id, name, money, gameManager) {
    this.id = id
    this.name = name
    this.money = money
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
}

export default Player
