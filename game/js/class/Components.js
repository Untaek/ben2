import GameManager from './GameManager'

const components = (function Com() {
  /** @param {GameManager} gm */
  function Components(gm) {
    const gameManager = gm
    const game = gameManager.phaser
    const that = this

    this.button = (x, y, text, visible, callback, matchContainer) => {
      const button = game.add.group()

      const base = game.add.button(
        x,
        y,
        'menu',
        callback,
        this,
        null,
        null,
        null,
        null,
        button
      )

      const textcomponent = game.add.text(
        x,
        y,
        text,
        {
          fill: '#ffffff'
        },
        button
      )

      if (matchContainer == true) base.width = textcomponent.width

      if (visible == undefined) button.visible = true
      else button.visible = visible

      return button
    }

    this.dicisionDialog = (
      title,
      description,
      OKCallback,
      NOCallback,
      visible
    ) => {
      const width = 340
      const height = 260
      const dialog = game.add.group()
      const base = game.add.sprite(
        game.world.width / 2 - width / 2,
        game.world.height / 2 - height / 2,
        'dialog',
        null,
        dialog
      )
      base.width = width
      base.height = height

      game.add.text(
        base.centerX - width / 2 + 30,
        base.y + 10,
        title,
        {},
        dialog
      )
      game.add.text(
        base.x + 30,
        base.y + 60,
        description,
        { fontSize: 16 },
        dialog
      )

      const OK = that.button(
        base.x + width / 6,
        base.y + height - 50,
        'YES',
        true,
        OKCallback,
        true
      )
      const NO = that.button(
        base.x + width / 2 + width / 6,
        base.y + height - 50,
        'NO',
        true,
        NOCallback,
        true
      )

      dialog.addMultiple([OK, NO])

      return dialog
    }
  }

  /** @type {Components} */
  let instance

  function getInstance(gameManager) {
    if (instance == undefined) {
      instance = new Components(gameManager)
    }
    return instance
  }

  return getInstance
})()

export default components
