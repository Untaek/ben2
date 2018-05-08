import SocketIO from 'socket.io'
import db from '../db'
/**
 *
 * @param {SocketIO.Socket} socket
 */
const eventHandler = socket => {
    const sql_search = `SELECT room_id, user_id, COUNT(*) FROM
     participants WHERE room_id BETWEEN 0 AND 4 GROUP BY 
     room_id ORDER BY room_id ASC LIMIT 1`
    const sql_room = `INSERT INTO tbl_games (class) VALUES(?)`
    const sql = `INSERT INTO tbl_participants
    (user_id, room_id) VALUES(?, ?)`
    const sql_leave = `DELETE FROM tbl_participants WHERE user_id=1`
    const sql_foreign = `ALTER TABLE `
    socket.on('joingame', () => {
        const userID = socket.handshake.session.id
        if(userID){
            db.getConnection((err, connection) => {
                if (err) throw err
                connection.query(sql, [0,0], (err, result) => {
                    if(err) throw err
    
                    socket.join(roomID, (err) => {
                        if(err) throw err
                        socket.emit('joingame', roomID)
                    })
                })
            })
        }
    })
    socket.on('createroom', (cls) => {
        console.log(socket.handshake.session)
        if(1){
            db.getConnection((err, connection) => {
                if(err) throw err
                connection.query(sql_room, [0], (err, result) => {
                    if(err) throw err  
                    
                    connection.query(sql, [1,1], (err, result) => {
                        if(err) throw err
        
                        socket.join(1, (err)=> {
                            if(err) throw err
                            socket.emit('joingame', 1)
                            console.log(socket.handshake.session)
                        })
                    })
                })
                
            })
        }
    })
    socket.on('exitroom', () => {
        db.getConnection((err, connection) => {
            if(err) throw err
            connection.query(sql_leave, [], (err, result) => { })
        })
    })
    }

export default eventHandler
