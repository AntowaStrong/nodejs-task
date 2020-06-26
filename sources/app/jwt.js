const jwt    = require('jsonwebtoken')
const config = require('../config') 

module.exports = { 
  encode: (data) => {
    return jwt.sign(data, config.secret, { expiresIn: 60 * 5, algorithm: 'RS256' }) 
  },
  decode: (token) => {
    return jwt.verify(token, config.secret, {algorithms: ['RS256']})
  }
}