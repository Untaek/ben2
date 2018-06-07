import GameManager from './GameManager'
import JQuery from 'jquery'

class Chatter {
  /**
   *
   * @param {GameManager} gameManager
   * @param {JQuery<HTMLElement>} container
   */
  constructor(gameManager, container) {
    this.gameManager = gameManager
    this.$container = container
    this.$playerList = this.$container.children('#list-user')
    this.$chatContent = this.$container.children('#content')
    this.$sender = this.$container.children('#sender')
    JQuery.this.$sender.on('keydown', 'input', function(e) {
      if (e.keyCode == 13 && $('#sender > input').val().length > 0) {
        $('#sender > button').click()
      }
    })

    this.$sender.on('click' || 'keydown', 'button', function() {
      const $input = $('#sender > input')
      this.ga
      $input.val('')
    })
  }

  /*************************************************
   * Deal a Dynamical layout                       *
   *************************************************/
  addNoticeRow(message) {
    this.$chatContent.append(`<li>${message}</li>`)
  }

  addChatRow(sender, message) {
    if (sender) {
      this.$chatContent.append(`<li>${sender}: ${message}</li>`)
    }
  }

  updatePlayerList() {
    this.$playerList.html('')
    this.gameManager.players.forEach(player => {
      this.$playerList.append(this.playerListRow(player))
    })
  }

  joinedPlayer(player) {
    console.log(player)
    this.updatePlayerList()
    this.addNoticeRow(`${player.name} has joined.`)
  }

  leftPlayer(player) {
    this.updateUserList()
    this.addNoticeRow(`${player.name} has lefted.`)
  }

  playerListRow(player) {
    return `
      <li>${player.name}</li>
    `
  }
}

export default Chatter
