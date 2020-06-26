const app        = require('./app')
const http       = require('http')
const https      = require('https')
const config     = require('../config')
const { isNull } = require('lodash')

let server = null

if (!config.https) {
  server = http.createServer(app)
} else {
  if (isNull(config.cert) || isNull(config.key)) {
    throw new Error('config.cert or config.key missing')
  }

  server = https.createServer({
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
  }, app)
}

module.exports = server
