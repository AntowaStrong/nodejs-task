const db     = require('./db')
const app    = require('./app')
const server = require('./server')
const models = require('../src/models')
const config = require('../config')

let bootstraped = false 

let bootstrap = () => {
  if (bootstraped) {
    return
  }

  app.use(require('../src/routes'))

  app.listen(config.port, () => {
    console.log('App started on port: ' + config.port)
  })

  bootstraped = true
}

module.exports = { 
  db,
  app,
  server,
  models,
  bootstrap
}