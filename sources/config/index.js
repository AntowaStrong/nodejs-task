const path                 = require('path')
const dotenv               = require('dotenv')
const parseArgs            = require('minimist')
const { has, isUndefined } = require('lodash')

dotenv.config()

const args       = parseArgs(process.argv.slice(2))
const enviroment = process.env

const variable = function (name, _default = undefined)
{
  if (has(args, name)) {
    return args[name]
  } else if (has(enviroment, name)) {
    switch (enviroment[name]) {
      case 'true':
        return true
      case 'false':
        return false
      case 'null':
        return null
      default:
        return enviroment[name]
    }
  } else {
    if (isUndefined(_default)) {
      throw new Error(`Variable ${name} not exist`)
    } else {
      return _default
    }
  }
}

const config = {
  https: variable('HTTPS', false),
  cert: variable('CERT', null),
  key: variable('KEY', null),
  port: variable('PORT', 8118),
  mysql: {
    name: variable('MYSQL_NAME', null),
    host: variable('MYSQL_HOST', 'localhost'),
    username: variable('MYSQL_USERNAME', 'root'),
    password: variable('MYSQL_PASSWORD', 'root'),
    port: variable('MYSQL_PORT', 3306),
    dialect: variable('MYSQL_DIALECT', 'mysql'),
    socketpath: variable('MYSQL_SOCKETPATH', null),
    debug: variable('MYSQL_DEBUG', false),
  },
  directory: path.resolve('../')
}

module.exports = config