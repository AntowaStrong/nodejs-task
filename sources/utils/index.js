const { isNull } = require('lodash')

module.exports = { 
  sequelizeOptionsFromConfig: (config) => {
    let settings = {
      logging: config.mysql.debug ? console.log : false,
      dialect: config.mysql.dialect,
      database: config.mysql.name,
      username: config.mysql.username, 
      password: config.mysql.password
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

    return settings
  }
}