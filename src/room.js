class RoomManager {
  constructor() {
    /**
     * @type {Room[]}
     */
    this.roomList = new Array()
  }

  get length() {
    return this.roomList.length
  }

  createRoom(owner) {
    this.roomList = _.concat(this.roomList, new Room(owner))
  }
}

class Room {
  constructor(owner) {
    this.roomID = _.uuid()
    this.userList = [owner]
    this.state = 0
    this.owner = owner
    this.config = {
      minimumFund: 500
    }
  }

  get length() {
    return this.userList.length
  }

  get isJoinable() {
    return this.state === 0
  }

  join(userID) {
    if (!this.isJoinable) {
      return false
    }
    this.userList = _.concat(this.userList, userID)

    if (this.length >= 4) {
      this.state = 1
    }

    return true
  }

  leave(userID) {
    this.userList = _.remove(this.userList, userID)

    return true
  }
}

export { RoomManager, Room }
