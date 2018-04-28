import hapi from 'hapi'
import database from './db'
import Mongo from 'mongodb'

/**
 * @type {Mongo.Db}
 */
let db
database.connect().then(d => (db = d))

/**
 * @param {hapi.Request} req
 * @param {hapi.ResponseToolkit} h
 */
const kakaoLogin = async (req, h) => {
  const user = JSON.parse(req.payload)
  console.log(req.payload)

  try {
    const result = await db
      .collection('users')
      .updateOne({ id: user.id }, { $set: user }, { upsert: true })

    const code = result.upsertedCount ? 200 : 304
    return h.response().code(code)
  } catch (e) {
    console.log(e)
  }
}

/**
 * @type {hapi.ServerRoute[]}
 */
const route = () => {
  return [
    {
      path: '/auth',
      method: 'post',
      handler: kakaoLogin
    },
    {
      path: '/test',
      method: 'get',
      handler: (request, h) => h.file('test.html')
    }
  ]
}

export default route
