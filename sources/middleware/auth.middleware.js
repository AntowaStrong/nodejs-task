const { isString }              = require('lodash')
const { UserModel, TokenModel } = require('../models')

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
  try {
    let token = parse(request)

    request.token = token

    token = await TokenModel.findOne({ 
      where: {
        valid: true,
        token: token
      }
    })

    if (!token) {
      return response.fail('INVALID_TOKEN', 403) 
    }

    if (!token.validate()) {
      await token.invalidate()

      return response.fail('INVALID_TOKEN', 403) 
    } 

    let user = await UserModel.findOne(
      {
        uid: token.uid
      }
    )

    if (!user) {
      return response.fail('USER_NOT_FOUND', 403) 
    }

    request.user  = user
    
    next()
  } catch (e) {
    return response.fail(e.message, 403) 
  }
}