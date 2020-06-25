const config = require('./index')

let settings = {
  config.mysql.name,
   config.mysql.username, 
   config.mysql.password, 
  logging: config.mysql.debug ? console.log : false,
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

module.exports = {
  test: settings,
  production: settings,
  development: settings
}


