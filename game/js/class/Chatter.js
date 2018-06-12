import $ from 'jquery'

import GameManager from './GameManager'
import { M } from '../const'

class Chatter {
  /**
   * @param {GameManager} gameManager
   */
  constructor(gameManager) {
    this.gameManager = gameManager
    this.socket = this.gameManager.socket
    this.$container = $('#chat')
    this.$container.height(this.gameManager.phaser.height)
    this.$playerList = this.$container.children('#list-user')
    this.$chatContent = this.$container.children('#content')
    this.$sender = this.$container.children('#sender')
    this.$sender.on('keydown', 'input', function(e) {
      if (e.keyCode == 13 && $('#sender > input').val().length > 0) {
        $('#sender > button').click()
      }
    })

    const that = this

    this.$sender.on('click' || 'keydown', 'button', function() {
      const $input = $('#sender > input')
      that.gameManager.controller.chat($input.val())
      $input.val('')
    })

    // ad-hoc point for chatting
    this.socket.on(M.CHAT_MSG, payload => {
      const name = payload.name
      const message = payload.message

      that.addChatRow(name, message)
    })
  }

  /*************************************************
   * Deal a Dynamical layout                       *
   *************************************************/
  addNoticeRow(message) {
    this.$chatContent.prepend(`<li>${message}</li>`)
    this.$chatContent.scrollTop(this.$chatContent[0].scrollHeight)
  }

  addChatRow(sender, message) {
    if (sender) {
      this.$chatContent.prepend(`<li>${sender}: ${message}</li>`)
      this.$chatContent.scrollTop(this.$chatContent[0].scrollHeight)
    }
  }

  updatePlayerList() {
    this.$playerList.html('')
    this.gameManager.currentRoom.players.forEach(player => {
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
