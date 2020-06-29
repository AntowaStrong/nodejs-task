const db          = require('./db')
const app         = require('./app')
const server      = require('./server')
const models      = require('../models')
const config      = require('../config')

let started = false 

let start = () => {
  if (started) {
    return
  }

  console.log('App starting...')

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