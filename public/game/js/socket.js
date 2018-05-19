const M = {
  CONNECT: 'connect',
  CREATE_ROOM: 'createroom',
  SEARCH_ROOM: 'searchroom',
  ENTER_ROOM: 'joingame',
  EXIT_ROOM: 'exitroom',
  CREATE_CHAT: 'createchat',
  ENTER_CHAT: 'joinchat',
  EXIT_CHAT: 'exitchat',
  CHAT_MSG: 'chatmsg',
  ROLL_DICE: 'rolldice',
  START_GAME: 'startgame'
}

const CLASS = {
  TEAM: 'team',
  INDIVIDUAL: 'individual'
}

const socketHandler = (function() {
  const config = { host: 'http://localhost/', port: 3000 }
  const socket = io(config)

  const $chatContainer = $('#chat')
  const $userList = $chatContainer.children('#list-user')
  const $chatContent = $chatContainer.children('#content')

  let me

  /***********************************************
   *        for a testing                        *
   ***********************************************/
  $('#sender').on('click', 'button', function() {
    addChatRow('asd', 'acz')
  })

  /*************************************************
   * Deal a Dynamical layout                       *
   *************************************************/
  function addNoticeRow(message) {
    $chatContent.append(`<li>${message}</li>`)
  }

  function addChatRow(sender, message) {
    if (sender) {
      $chatContent.append(`<li>${sender}: ${message}</li>`)
    }
  }

  function updateUserList() {}

  function joinedUser(user) {
    updateUserList()
    addNoticeRow(`${user} has joined.`)
  }

  function leftUser(user) {
    updateUserList()
    addNoticeRow(`${user.name} has lefted.`)
  }

  function exitRoom() {}

  return {
    socket
  }
})()
