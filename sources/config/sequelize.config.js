const config                         = require('./index')
const { sequelizeOptionsFromConfig } = require('../utils')

let options = sequelizeOptionsFromConfig(config)

module.exports = {
  test: options,
  production: options,
  development: options
}