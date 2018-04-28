import mongo from 'mongodb'

const db = () => {
  /**
   * @type {mongo.Db}
   */
  let db

  const url = 'mongodb://localhost:27017'
  const dbName = 'ben2'

  /**
   * @type {mongo.MongoClientOptions}
   */
  const options = {
    poolSize: 10
  }

  const mongoClient = mongo.MongoClient

  const connect = () => {
    return mongoClient
      .connect(url, options)
      .then(client => client.db(dbName))
      .catch(err => console.log(err))
  }

  const init = async () => {
    db = await connect()
  }

  return db
}

export default db()
