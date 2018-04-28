import mongo from 'mongodb'

/**
 * @type {mongo.Db}
 */
let mongodb
const mongoClient = mongo.MongoClient

const DBWrapper = db => {
  const instance = db
  return {
    instance
  }
}

class DB {
  constructor() {
    /**
     * @type {mongo.Db}
     */
    this.instance = null
    this.url = 'mongodb://localhost:27017'
    this.dbName = 'ben2'
    this.options = {
      poolSize: 10
    }
  }

  async connect() {
    const client = await mongoClient.connect(this.url, this.options)
    const db = client.db(this.dbName)

    return db
  }
}

export default new DB()
