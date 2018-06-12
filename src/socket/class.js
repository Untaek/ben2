class Player {
  constructor(data) {
    this.id = data.id
    this.marker_position = data.position
    this.money = data.money
    this.name = data.name
    this.land = []
  }
  move(data) {
    this.marker_position = this.marker_position + data
  }
}

class Game {
  constructor() {
    this.players = {}
    this.tiles = tiles
    this.turn = 0
    this.dice = 0
  }
  generate() {
    this.players = new Map()
  }
  init(player) {
    this.players = [new Player(player)]
  }
  join(data) {
    //this.players = [...this.players, new Player(data)]
    this.players.set(data.id, new Player(data))
  }
  movemarker(data) {
    this.players[data.id].marker_position = data
    console.log(this.players.get(data.id).marker_position)
    console.log(this.players[data.id])
  }
  buyland(result) {
    this.tiles[result.position].occupy(result.id)
    this.players.get(result.id).money -= result.value
    console.log(this.tiles[result.position].name + ' owner is ' + result.id)
    console.log(this.players.get(result.id))
  }
  selltile(result) {
    this.tiles[result.position].retrocession()
    this.players.get(result.id)
    this.players.get(result.id).money += result.value
    console.log(this.tiles[result.position].name + 'has been returned')
  }
  rolldice(value) {
    this.dice = value
    console.log('ROLL!! :' + this.dice)
  }
}

class Tile {
  /**
   *
   * @param {string} name
   * @param {number} value
   * @param {number} position
   */
  constructor(name, value, position) {
    this.name = name
    this.value = value
    this.position = position
    this.owner = null
  }
  occupy(playerID) {
    this.owner = playerID
  }
  retrocession() {
    this.owner = null
  }
}

class Gamemanager {
  constructor(data) {
    //this.games = []
    this.games = {}
  }
  generate() {
    //this.games.map(game => {})
    this.games = new Map()
  }
  init(game) {
    //this.games = [new Game(game)]
    this.games = [new Game(game)]
  }

  createGame(data) {
    //this.games = [...this.games, new Game(data)]
    this.games.set(data.key, new Game(data))
  }
  deleteGame() {}
}

class Asset {
  constructor() {}
}

const tiles = [
  new Tile('start', 0, 0),
  new Tile('PIVX', 10, 1),
  new Tile('Digibyte', 12, 2),
  new Tile('Dogecoin', 14, 3),
  new Tile('Qtum', 22, 4),
  new Tile('Verge', 32, 5),
  new Tile('Zenash', 36, 6),
  new Tile('Monacoin', 36, 7),
  new Tile('Golem', 36, 8),
  new Tile('Status', 36, 9),
  new Tile('Steem', 36, 10),
  new Tile('OmiseGO', 36, 11),
  new Tile('Zcash', 36, 12),
  new Tile('Dash', 36, 13),
  new Tile('NEO', 36, 14),
  new Tile('TRON', 36, 15),
  new Tile('ADA', 36, 16),
  new Tile('Litecoin', 36, 17),
  new Tile('EOS', 36, 18),
  new Tile('Bitcoin Cash', 36, 19),
  new Tile('Ripple', 36, 20),
  new Tile('Etherium', 36, 21),
  new Tile('Bitcoin', 36, 22),
  new Tile('Cash', 36, 23)
]
const gamemanager = new Gamemanager()
const games = new Game()
gamemanager.generate()
export { Player, Game, Gamemanager, Asset, Tile, gamemanager }
