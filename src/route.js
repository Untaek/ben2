import hapi from 'hapi'
import db from './db'

const getKakaoProfile = token => {
  fetch('https://kapi.kakao.com/v1/api/talk/profile', {
    method: 'GET',
    headers: { Authorization: token }
  })
    .then(JSON.stringify)
    .then(console.log)
}

const newToken = (req, h) => {
  console.log(req.payload)

  return {
    code: 'good'
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
      handler: newToken
    },
    {
      path: '/test',
      method: 'get',
      handler: (request, h) => h.file('test.html')
    }
  ]
}

export default route
