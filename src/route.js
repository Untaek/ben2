import hapi from 'hapi'

const getKakaoProfile = token => {
  fetch('https://kapi.kakao.com/v1/api/talk/profile', {
    method: 'GET',
    headers: { Authorization: token }
  })
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
      handler: getKakaoProfile
    },
    {
      path: '/test',
      method: 'get',
      handler: (request, h) => h.file('test.html')
    }
  ]
}

export default route
