class Player {
  constructor(data) {
    this.id = data.id
    this.marker_position = data.position
    this.money = 500
    this.name = data.name
    this.land = []
  }
  move(data) {
    this.marker_position = this.marker_position + data
  }
}
class Game {
  constructor() {
    this.players = []
    this.turn = 0
    this.status = 1
    this.tiles = 'tiles'
  }
  generate() {
    this.players.map(player => {})
  }
  init(player) {
    this.players = [new Player(player)]
  }
  join(data) {
    this.players = [...this.players, new Player(data)]
  }
  movemarker(data) {
    this.players[data.id].marker_position = data
  }
  constructbuilding(data) {}
  buyland(data) {}
}

export { Player, Game }
