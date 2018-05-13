const parent = document.getElementById('game')

const config = {
  renderer: Phaser.CANVAS,
  width: 800,
  height: 600,
  antialias: true,
  parent: parent
}

const game = new Phaser.Game(config)

let users, horses, tiles, score, board_base

const Game = {
  preload: () => {
    game.load.image('board', 'wood4.png')
    game.load.image('cell', 'box.png')
  },

  create: () => {
    game.stage.backgroundColor = '#80dfff'

    const boardX = 30
    const boardY = 30
    const boardWidth = game.world.width - boardY * 2
    const boardHeight = game.world.height - boardX * 2

    board_base = game.add.group()
    const board = board_base.create(boardX, boardY, 'board')
    board.width = boardWidth
    board.height = boardHeight

    for (let i = 0; i < 9; i++) {
      const width = boardWidth / 9.0
      const height = boardHeight / 9.0
      const cellTop = board_base.create(boardX + i * width, boardY, 'cell')
      const cellBot = board_base.create(
        boardX + i * width,
        boardHeight - boardY,
        'cell'
      )
      const cellLeft = board_base.create(boardX, boardY + i * height, 'cell')
      const cellRight = board_base.create(
        boardWidth - width + boardX,
        boardY + i * height,
        'cell'
      )

      cellTop.width = width
      cellTop.height = height
      cellBot.width = width
      cellBot.height = height
      cellRight.width = width
      cellRight.height = height
      cellLeft.width = width
      cellLeft.height = height
    }
  },

  update: () => {}
}

game.state.add('Menu', Menu)
game.state.add('Game', Game)
game.state.start('Menu')
