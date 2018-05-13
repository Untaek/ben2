import server from './src/server'

server.listen(3000, () => {
  console.log('express server is running: ', 'http://localhost:3000/')
})
