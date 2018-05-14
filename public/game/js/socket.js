const M = {
  CONNECT: 'connect',
  CREATE_ROOM: 'createroom',
  SEARCH_ROOM: 'searchroom',
  ENTER_ROOM: 'joingame',
  EXIT_ROOM: 'exitroom',
  CREATE_CHAT: 'createchat',
  ENTER_CHAT: 'joinchat',
  EXIT_CHAT: 'exitchat',
  CHAT_MSG: 'chatmsg'
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
    console.log($userList)
    console.log(participants)
  })

  /************************************************
   * Send a socket message                        *
   ************************************************/
  function createRoom(cl) {
    socket.emit(M.CREATE_ROOM, { class: cl })
  }

  function searchroom(cl) {
    socket.emit(M.SEARCH_ROOM, { class: cl })
  }

  function enterRoom(cl) {
    socket.emit(M.ENTER_ROOM, { class: cl })
  }

  function sendChat(msg) {
    socket.emit(M.CHAT_MSG, msg)
  }

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

  function updateUserList() {
    $userList.html($userList.eq(0))
    _.forOwn(participants, function(u) {
      $userList.append(u.name)
    })
  }

  function joinedUser(user) {
    if (user) {
      participants = _.assign(participants, user)
    }
    updateUserList()
    addNoticeRow(`${user.name} has joined.`)
  }

  function leftUser(user) {
    if (user) {
      participants = _.pickBy(participants, (v, k) => !_.has(v, user.id))
    }
    updateUserList()
    addNoticeRow(`${user.name} has lefted.`)
  }

  function exitRoom() {}

  /**************************************************
   * message receiver                               *
   **************************************************/
  function receiveMessage() {
    socket
      .on(M.CONNECT, result => {
        console.log('socket connected')
      })
      .on(M.CREATE_ROOM, result => {
        console.log(M.CREATE_ROOM, result)
        game.state.start('Game')
        me = result.user
        participants = {}
      })
      .on(M.ENTER_ROOM, result => {
        console.log(M.ENTER_ROOM, result)
        joinedUser(user)
        game.state.start('Game')
      })
      .on(M.EXIT_ROOM, result => {
        console.log(M.EXIT_ROOM, result)
        leftUser(user)
      })
      .on(M.CREATE_CHAT, result => {
        console.log(result)
      })
      .on(M.ENTER_CHAT, result => {
        console.log(result)
      })
      .on(M.EXIT_CHAT, result => {
        console.log(result)
      })
      .on(M.CHAT_MSG, result => {
        console.log(result)
        addChatRow(result.sender, result.message)
      })
  }

  receiveMessage()

  return {
    createRoom,
    searchroom,
    enterRoom,
    exitRoom,
    sendChat
  }
})()
