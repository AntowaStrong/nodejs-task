const db          = require('./db')
const app         = require('./app')
const jwt         = require('./jwt')
const server      = require('./server')
const models      = require('../models')
const config      = require('../config')

let started = false 

let start = () => {
  if (started) {
    return
  }

  console.log('App starting...')

  app.use(require('../routes'))

  app.listen(config.port, () => {
    console.log('App started on port: ' + config.port)
  })

  started = true
}

module.exports = {
  db,
  app,
  jwt,
  server,
  models,
  start
}