import mysql from 'mysql'

const config = {
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'a1234567',
  database: 'ben2',
  multipleStatements: true //dev
}

const sqlinit = `
  DROP TABLE IF EXISTS tbl_participants;
  DROP TABLE IF EXISTS tbl_games;
  DROP TABLE IF EXISTS tbl_users
`

const sql1 = `
CREATE TABLE IF NOT EXISTS tbl_users (
  id BIGINT AUTO_INCREMENT,
  kakao_id INT NOT NULL,
  nickname VARCHAR(30) NOT NULL,
  money BIGINT DEFAULT 1000,
  sign_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE(kakao_id)
)
`

const sql2 = `
CREATE TABLE IF NOT EXISTS tbl_games (
  id BIGINT AUTO_INCREMENT,
  class VARCHAR(11) NOT NULL,
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)
`

const sql3 = `
CREATE TABLE IF NOT EXISTS tbl_participants (
  user_id BIGINT NOT NULL,
  room_id BIGINT NOT NULL,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES tbl_users(id),
  FOREIGN KEY (room_id) REFERENCES tbl_games(id)
)
`

const pool = mysql.createPool(config)

pool.getConnection((err, conn) => {
  if (err) throw err
  console.log('mysql module is connected')
  conn.query(
    `${sqlinit}; ${sql1}; ${sql2}; ${sql3}`,
    (err, results, fields) => {
      if (results) console.log('mysql is ready')
    }
  )
})

/**
 * @param {mysql.PoolConnection} conn
 * @param {string} sql
 * @param {any[]} params
 */
const query = (conn, sql, params) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, results, fields) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

/**
 * @type {() => Promise<mysql.PoolConnection>}
 */
const getPool = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err)
      resolve(conn)
    })
  })
}

const release = conn => {
  conn.release()
}

const internal = () => {
  return {
    query,
    getPool,
    release
  }
}

export default internal()
