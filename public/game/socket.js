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

  function createRoom(cl) {
    socket.emit(M.CREATE_ROOM, { class: cl })
  }

  function searchroom(cl) {
    socket.emit(M.SEARCH_ROOM, { class: cl })
  }

  function enterRoom(cl) {
    socket.emit(M.ENTER_ROOM, { class: cl })
  }

  function exitRoom() {
    socket.emit(M.EXIT_ROOM)
  }

  function sendChat(msg) {
    socket.emit(M.CHAT_MSG, { msg })
  }

  function receiveMessage() {
    socket
      .on(M.CONNECT, result => {
        console.log('socket connected')
      })
      .on(M.CREATE_ROOM, result => {
        console.log(result)
      })
      .on(M.SEARCH_ROOM, result => {
        console.log(result)
      })
      .on(M.ENTER_ROOM, result => {
        console.log(result)
      })
      .on(M.EXIT_ROOM, result => {
        console.log(result)
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
      })
  }

  function messageHandler() {
    receiveMessage()
    return {
      createRoom,
      searchroom,
      enterRoom,
      exitRoom,
      sendChat
    }
  }

  return messageHandler()
})()
