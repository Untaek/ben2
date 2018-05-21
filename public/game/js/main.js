const parent = document.getElementById('game')

const config = {
  renderer: Phaser.CANVAS,
  width: 800,
  height: 600,
  antialias: true,
  parent: parent
}

let board_base
const game = new Phaser.Game(config)
/**
 * @type {GameManager}
 */
let gameManager, chatter

let Loading = {
  preload: () => {
    game.load.image('board', 'wood4.png')
    game.load.image('cell', 'box.png')
    for (let i = 1; i <= 6; i++) game.load.image(`dice${i}`, `dice${i}.png`)
    game.create.texture('btn', ['B'], 200, 100, 0)
    game.load.image('marker1', 'marker1.jpg')
    console.log('preload Loading')
  },

  create: () => {
    game.state.start('Menu')
    gameManager = new GameManager(game)
    chatter = new Chatter(gameManager, $('#chat'))
    console.log('create Loading')
  }
}

game.state.add('Loading', Loading)
game.state.add('Game', Game)
game.state.add('Menu', Menu)

game.state.start('Loading')
