import GameManager from './GameManager'

class PlayerStat {
  /**
   * @param {GameManager} gameManager
   * @param {number} index
   */
  constructor(gameManager, index) {
    this.gameManager = gameManager
    this.index = index
    this.gameRoom = null
    this.sprite = null
    this.player = null
    this.picture = null
    const game = this.gameManager.phaser
    const baseX = this.gameManager.statX
    const baseY = this.gameManager.statY
    this.sprite = game.add.group()
    this.sprite.x =
      Math.floor(this.index / 2) * (game.world.centerX - baseX) + baseX
    this.sprite.y =
      Math.floor(this.index % 2) * (game.world.centerY - baseY - 50) + baseY

    this.x = this.sprite.x
    this.y = this.sprite.y

    this.image = game.add.sprite(0, 0, 'marker1', 0, this.sprite)
    this.image.width = 80
    this.image.height = 80
    this.image.visible = false
    this.text_name = game.add.text(this.image.width, 0, ``, {}, this.sprite)
    this.text_money = game.add.text(
      this.image.width,
      0 + 30,
      `untaek`,
      {},
      this.sprite
    )
    this.moneyIncDec = game.add.text(
      this.image.width,
      0 + 60,
      `$500`,
      {},
      this.sprite
    )
  }

  update(player) {
    this.player = player
    this.text_name.text = player.name
    this.text_money.text = player.money
  }
}

export default PlayerStat
