const db     = require('./db')
const app    = require('./app')
const server = require('./server')
const models = require('../src/models')
const config = require('../config')

let started = false 

let start = () => {
  if (started) {
    return
  }

  console.log('App starting...')

  app.use(require('../src/routes'))

  app.listen(config.port, () => {
    console.log('App started on port: ' + config.port)
  })

  started = true
}

module.exports = { 
  db,
  app,
  server,
  models,
  start
}