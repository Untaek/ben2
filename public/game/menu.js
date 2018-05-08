function button(x, y, text, key, handler) {
  const startButton_base = game.add.group()
  const startButton = startButton_base.create(x, y, 'menu')
  const startText = game.add.text(
    x,
    y,
    text,
    { backgroundColor: '#eeeeee' },
    startButton_base
  )
  startButton.inputEnabled = true
  startButton.input.useHandCursor = true
  startButton.events.onInputDown.add(handler, game.this)
}

const Menu = {
  preload: () => {
    game.create.texture('menu', ['C'], 200, 100, 0)
  },

  create: () => {
    game.stage.backgroundColor = '#1eee56'

    button(200, 100, 'INDIVIDUAL', 'menu', () => {
      socketHandler.enterRoom('individual')
      console.log('individual')
    })
    button(450, 100, 'TEAM', 'menu', () => {
      socketHandler.enterRoom('team')
      console.log('team')
    })
    button(250, 300, 'MAKE A ROOM', 'menu', () => {
      socketHandler.createRoom('team')
      console.log('MAKE A ROOM')
    })
  }
}
