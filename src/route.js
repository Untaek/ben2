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

  const sql1 = `SELECT * from tbl_users WHERE kakao_id = ?`
  const sql2 = `INSERT INTO tbl_users 
  (kakao_id, nickname) VALUES (?, ?)`
  db.getConnection((err, connection) => {
    connection.query(sql1, [user.id], (err, results1) => {
      if (err) throw err
      console.log(results1)

      if (results1.length > 0) {
        connection.release()
        req.session.user = {
          id: results1[0].id
        }
<<<<<<< HEAD
        req.session.save()
        res.status(200).end()
=======
        console.log(req.sessionID)
        res.sendStatus(200)
>>>>>>> f27398d5aefe34988e9e4d975b774ee31ffe195d
      } else {
        connection.query(sql2, [user.id, p.nickname], (err, results2) => {
          if (err) throw err
          console.log(results2)
          connection.release()
          req.session.user = {
            id: results2.insertId
          }
<<<<<<< HEAD
          req.session.save()
          res.status(201).end()
=======
          console.log(req.sessionID)
          res.sendStatus(201)
>>>>>>> f27398d5aefe34988e9e4d975b774ee31ffe195d
        })
      }
    })
  })
}

const router = express.Router()

router.post('/auth', kakaoLogin)
router.get('/test', (req, res) => {
  console.log(req.sessionID)
  res.end('haha')
})

export default router
