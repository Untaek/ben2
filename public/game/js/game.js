let Game = {
  preload: () => {
    console.log('preload Game')
  },

  create: () => {
    console.log('create Game')
    game.stage.backgroundColor = '#80dfff'

    const boardX = 30
    const boardY = 30
    const boardWidth = game.world.width - boardY * 2
    const boardHeight = game.world.height - boardX * 2

    board_base = game.add.group()
    const board = board_base.create(boardX, boardY, 'board')
    board.width = boardWidth
    board.height = boardHeight

    for (let i = 0; i < 7; i++) {
      const width = boardWidth / 7.0
      const height = boardHeight / 7.0
      const cellTop = board_base.create(boardX + i * width, boardY, 'cell')
      const cellBot = board_base.create(
        boardX + i * width,
        boardHeight + boardY - boardHeight / 7.0,
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

    gameManager.tiles.map((tile, i) => {
      if (i < 6) {
        game.add.text(
          boardX,
          boardHeight / 7.0 * (7 - i),
          tile.name,
          {},
          board_base
        )
      } else if (i < 12) {
        game.add.text(
          boardWidth / 7.0 * (i - 6) + boardX,
          boardY,
          tile.name,
          {},
          board_base
        )
      } else if (i < 18) {
        game.add.text(
          boardWidth,
          boardHeight / 7.0 * (i - 11),
          tile.name,
          {},
          board_base
        )
      } else {
        game.add.text(
          boardWidth / 7.0 * (24 - i) + boardX,
          boardHeight,
          tile.name,
          {},
          board_base
        )
      }
    })

    gameManager.generate()

    button(150, 440, 'roll a dice', 'btn', () => {
      gameManager.rollDice()
    })
  },

  update: () => {}
}
