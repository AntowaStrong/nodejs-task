const config                         = require('../config')
const { Sequelize }                  = require('sequelize')
const { sequelizeOptionsFromConfig } = require('../utils')

let options = sequelizeOptionsFromConfig(config)

const db = new Sequelize(config.mysql.name, config.mysql.username, config.mysql.password, options)

module.exports = db