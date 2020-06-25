const config        = require('../config')
const { isNull }    = require('lodash')
const { Sequelize } = require('sequelize')

let settings = {
  logging: config.mysql.debug,
  dialect: config.mysql.dialect
}

if (isNull(config.mysql.socketpath)) {
  settings.host = config.mysql.host
} else { 
  settings.dialectOptions = {
    socketPath: config.mysql.socketpath,
    supportBigNumbers: true,
    bigNumberStrings: true
  }
}

if (!isNull(config.mysql.port)) {
  settings.port = config.mysql.port
}

const db = new Sequelize(config.mysql.name, config.mysql.username, config.mysql.password, settings)

module.exports = db