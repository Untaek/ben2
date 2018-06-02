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
  START_GAME: 'startgame',
  MOVE_MARKER: 'movemarker'
}

const CLASS = {
  TEAM: 'team',
  INDIVIDUAL: 'individual'
}

const socketHandler = (function() {
  const config = { host: 'http://localhost/', port: 3000 }
  const socket = io(config)

  function sendMessage(type, payload) {
    socket.emit(type, payload)
  }

  return {
    socket,
    sendMessage
  }
})()
