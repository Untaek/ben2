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
  const player = req.body
  const p = player.properties
  console.log(req.sessionID)
  console.log(req.body)
  console.log(p)

  const sql1 = `SELECT * from tbl_users WHERE kakao_id = ?`
  const sql2 = `INSERT INTO tbl_users (kakao_id, nickname) VALUES (?, ?)`

  try {
    const conn = await db.getPool()
    const result1 = await db.query(conn, sql1, [player.id])

    if (result1.length > 0) {
      req.session.player = {
        id: result1[0].id,
        name: result1[0].nickname
      }
      res.sendStatus(200)
    } else {
      const result2 = await db.query(conn, sql2, [player.id, p.nickname])
      console.log(result2)
      req.session.player = {
        id: result2.insertId,
        name: p.nickname
      }
      res.sendStatus(201)
    }
    db.release(conn)
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
