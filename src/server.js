import Hapi from 'hapi'

/**
 * @type {Hapi.ServerOptions} config
 */
const defaultConfig = {
  host: '0.0.0.0',
  port: 3001
}

/**
 * @param {?Hapi.ServerOptions} config
 */
const server = config => {
  /**
   * @type {Hapi.Server}
   */
  let hapi

  const start = async () => {
    hapi = config ? new Hapi.Server(config) : new Hapi.Server(defaultConfig)
    await hapi.start()
    console.log('Server is running')
    return hapi
  }

  return {
    start
  }
}

export default server
