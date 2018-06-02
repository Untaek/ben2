let Game = {
  preload: () => {
    console.log('preload Game')
  },

  create: () => {
    console.log('create Game')
    game.stage.backgroundColor = '#80dfff'

    gameManager.generate()

    button(150, 440, 'roll a dice', 'btn', () => {
      socketHandler.sendMessage(M.ROLL_DICE)
    })
  },

  update: () => {}
}
