
const { decode }        = require('../app/jwt')
const { UserModel }     = require('../models')
const { has, isString } = require('lodash')

const RegExp = /(\S+)\s+(\S+)/
const SCHEME = 'bearer'
const AUTH_HEADER = 'authorization'

const parse = (request) => {
  let header = request.headers[AUTH_HEADER]

  if (!header || !isString(header)) {
    return null
  }

  const [scheme = '', token = ''] = header.match(RegExp) || []

  if (SCHEME.toLowerCase() !== scheme.toLowerCase()) {
    return null
  }

  return token
} 

module.exports = async (request, response, next) => {
  let user    = null
  let payload = null 

  try {
    payload = decode(parse(request)) 
  } catch (e) {
    return response.status(403).json({
      errors: {
        msg: e.name
      }
    }) 
  }

  if (!has(payload, 'id')) {
    return response.status(403).json({
      errors: {
        msg: 'WronkPayload'
      }
    }) 
  }

  try {
    user = await UserModel.findOne(
      {
        id: payload.id
      }
    )
  } catch (e) {
    return response.status(403).json({
      errors: {
        msg: 'userNtf'
      }
    }) 
  }

  if (!user) {
    return response.status(403).json({
      errors: {
        msg: 'userNtf'
      }
    }) 
  } 

  request.user = user

  next()
}