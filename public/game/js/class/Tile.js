class Tile {
  constructor(name, value, position) {
    this.name = name
    this.value = value
    this.position = position
    this.owner = null
    this.visitor = []
  }
}

export default Tile
