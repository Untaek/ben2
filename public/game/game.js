const config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 800,
  antialias: true,
  state: {
    preload: preload,
    create: create,
    update: update
  }
}

const game = new Phaser.Game(config)

function preload() {
  game.load.baseURL = 'http://labs.phaser.io/'

  game.load.image('sky', 'assets/skies/space3.png')
  game.load.image('logo', 'assets/sprites/phaser3-logo.png')
  game.load.image('red', 'assets/particles/red.png')
}

function create() {
  game.stage.backgroundColor = '#ee3a2e'

  game.create.texture('score', ['C'], game.width, 80)
  game.add.sprite(0, 0, 'score')
}

function update() {}
