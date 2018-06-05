import { M } from '../const'

class Controller {
  /**
   * @param {SocketIO.Socket} socket
   */
  constructor(socket) {
    this.me = null
    this.socket = socket
  }

  emit(type, arg) {
    const bool = this.socket.emit(type, arg)
    console.log(`[emit] ${type}`, bool)
  }

  fetchMe() {
    this.emit(M.FETCH_ME)
  }

  createGame() {
    this.emit(M.CREATE_GAME)
  }

  findGame() {
    this.emit(M.FIND_GAME)
  }

  joinGame() {
    this.emit(M.JOIN_GAME)
  }

  exitGame() {
    this.emit(M.EXIT_GAME)
  }
}

export default Controller
