import express from 'express'
import _ from 'lodash'
import lodashuuid from 'lodash-uuid'
_.mixin(lodashuuid)

import db from './db'

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const kakaoLogin = async (req, res) => {
  console.log(req.body)
  const user = req.body
  const p = user.properties
  console.log(p)

  const sql1 = `SELECT * from tbl_users WHERE kakao_id = ?`
  const sql2 = `INSERT INTO tbl_users 
  (kakao_id, nickname) VALUES (?, ?)`
  try {
    const conn = await db.getPool()
    const result1 = await db.query(conn, sql1, [user.id])

    if (result1.length > 0) {
      db.release(conn)
      req.session.user = {
        id: results1[0].id
      }
      console.log(req.sessionID)
      res.sendStatus(200)
    } else {
      const result2 = await db.query(conn, sql2, [user.id, p.nickname])
      console.log(result2)
      db.release(conn)
      req.session.user = {
        id: result2.insertId
      }
      console.log(req.sessionID)
      res.sendStatus(201)
    }
  } catch (e) {
    console.log(e)
  }
}

const router = express.Router()

router.post('/auth', kakaoLogin)
router.get('/test', (req, res) => {
  console.log(req.sessionID)
  res.end('haha')
})

export default router
