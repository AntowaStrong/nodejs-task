const Joi                       = require('@hapi/joi') 
const phoneNumber               = require('joi-phone-number')
const { isUndefined }           = require('lodash')
const passwordComplexity        = require('joi-password-complexity')
const { UserModel, TokenModel } = require('../models')

Joi.extend(phoneNumber)

let validateCredentials = (credentials) => {
  let passwordOptions = {
    min: 8,
    max: 16,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
  }

  let scheme = Joi.object({
    id: Joi.alternatives().try(
      Joi.string().phoneNumber(),
      Joi.string().email()
    ).required(),
    password: passwordComplexity(passwordOptions).required()
  }) 
  
  return isUndefined(scheme.validate(credentials).error)
}

let validateRefresh = (parameters) => {
  let scheme = Joi.object({
    refresh: Joi.string().required()
  })

  return isUndefined(scheme.validate(parameters).error)
} 


module.exports = {
  login: async (request, response) => {
    if (validateCredentials(request.body)) {
      return response.fail('MISSING_PARAMETERS')
    }

    try {
      let user = UserModel.findOne({ 
        where: {
          id: request.body.id
        }
      })

      if (!user) {
        return response.fail('WRONG_CREDENTIALS')
      }
      
      if (!user.checkPassword(request.body.id)) {
        return response.fail('WRONG_CREDENTIALS')
      }

      let refresh = await TokenModel.generateRefreshToken(user.uid)
      let access  = await TokenModel.generateAccessToken(refresh) 

      if (!refresh || !access) {
        return response.fail()
      }

      response.success({
        refresh,
        access
      })
    } catch (e) {
      return response.fail()
    }
  },
  logup: (request, response) => {
    if (validateCredentials(request.body)) {
      return response.fail('MISSING_PARAMETERS')
    }

    try {
      let user = UserModel.create({
        id: request.body.id,
        password: request.body.password
      })

      if (!user) {
        return response.fail('USER_CANT_BE_CREATED')
      }

      let refresh = await TokenModel.generateRefreshToken(user.uid)
      let access  = await TokenModel.generateAccessToken(refresh, user.uid) 

      if (!refresh || !access) {
        return response.fail()
      }

      response.success({
        refresh,
        access
      })
    } catch (e) {
      response.fail()
    }
  },
  logout: (request, response) => { 
    try {
      if (!await TokenModel.invalidateAllBelongsTokens(request.token)) {
        return response.fail()
      }
      
      response.success()
    } catch (e) {
      response.fail()
    }
  },
  refresh: (request, response) => {    
    if (validateRefresh(request.body)) {
      return response.fail()
    }

    try {
      if (!await TokenModel.invalidateAllAccessTokens(request.body.refresh)) {
        return response.fail()
      }

      let access = await TokenModel.generateAccessToken(refresh) 

      if (!access) {
        return response.fail()
      }
      
      response.success({ 
        access 
      })
    } catch (e) {
      response.fail()
    }
  }
}