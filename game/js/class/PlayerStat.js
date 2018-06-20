import GameManager from './GameManager'
import Player from './Player'

class PlayerStat {
  /**
   * @param {GameManager} gameManager
   * @param {number} index
   */
  constructor(gameManager, index) {
    this.gameManager = gameManager
    this.index = index
    this.game = this.gameManager.phaser

    this.sprite = null
    this.player = null
    this.picture = null

    const boardX = 30
    const boardY = 30
    const boardWidth = this.game.world.width - boardY * 2
    const boardHeight = this.game.world.height - boardX * 2
    const baseX = boardX + boardWidth / 7.0
    const baseY = boardY + boardHeight / 7.0

    this.sprite = this.game.add.group()
    this.sprite.z = 10000
    this.sprite.x =
      Math.floor(this.index / 2) * (this.game.world.centerX - baseX) + baseX
    this.sprite.y =
      Math.floor(this.index % 2) * (this.game.world.centerY - baseY - 50) +
      baseY

    this.x = this.sprite.x
    this.y = this.sprite.y

    this.image = this.game.add.sprite(0, 0, `marker1`, 0, this.sprite)
    this.image.width = 80
    this.image.height = 80
    this.image.visible = false
    this.text_name = this.game.add.text(
      this.image.width,
      0,
      ``,
      {},
      this.sprite
    )
    this.text_money = this.game.add.text(
      this.image.width,
      0 + 30,
      ``,
      {},
      this.sprite
    )
    this.text_incdec = this.game.add.text(
      this.image.width,
      0 + 60,
      ``,
      {},
      this.sprite
    )
  }

  /** @param {Player} player */
  updatePlayer(player) {
    if (player) {
      this.image.visible = true
      this.player = player
      this.text_name.text = player.name
      this.text_money.text = `$${player.money}`

      const ic = player.getIncDecMoney()
      this.text_incdec.text = ic >= 0 ? `+$${ic}` : `${ic}`
      this.gameManager.phaser.load.image(
        `marker${this.player.id}`,
        this.player.picture_url
      )
      this.gameManager.phaser.load.onLoadComplete.add(() => {
        this.sprite = this.gameManager.phaser.add.sprite(
          0,
          0,
          `marker${player.id}`
        )
      }, this.gameManager.phaser)
    } else {
      this.image.visible = false
      this.player = null
      this.text_name.text = ''
      this.text_money.text = ''
      this.text_incdec.text = ''
    }
  }
}

export default PlayerStat
