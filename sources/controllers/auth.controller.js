const Joi                       = require('@hapi/joi') 
const phoneNumber               = require('joi-phone-number')
const { isUndefined }           = require('lodash')
const passwordComplexity        = require('joi-password-complexity')
const { UserModel, TokenModel } = require('../models')

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

  let phoneRule = Joi.extend(phoneNumber).string().phoneNumber()

  let scheme = Joi.object({
    id: Joi.alternatives().try(
      Joi.string().email(),
      phoneRule
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
      return response.fail('WRONG_PARAMETERS')
    }

    try {
      let user = await UserModel.findOne({ 
        where: {
          id: request.body.id
        }
      })

      if (!user) {
        return response.fail('WRONG_CREDENTIALS')
      }
      
      if (!user.checkPassword(request.body.password)) {
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
      return response.fail(e.message)
    }
  },
  logup: async (request, response) => {
    if (validateCredentials(request.body)) {
      return response.fail('WRONG_PARAMETERS')
    }

    try {
      let user = await UserModel.findOne({
        where: {
          id: request.body.id
        }
      })

      if (user) {
        return response.fail('USER_ALREADY_CREATED')
      }

      let model = await UserModel.create({
        id: request.body.id,
        password: request.body.password
      })

      if (!model) {
        return response.fail('USER_CANT_BE_CREATED')
      }

      let refresh = await TokenModel.generateRefreshToken(model.uid)
      let access  = await TokenModel.generateAccessToken(refresh) 

      if (!refresh || !access) {
        return response.fail()
      }

      response.success({
        refresh,
        access
      })
    } catch (e) {
      response.fail(e.message)
    }
  },
  logout: async (request, response) => { 
    try {
      if (!await TokenModel.invalidateAllBelongsTokens(request.token)) {
        return response.fail()
      }
      
      response.success()
    } catch (e) {
      response.fail(e.message)
    }
  },
  refresh: async (request, response) => {    
    if (!validateRefresh(request.body)) {
      return response.fail('WRONG_PARAMETERS')
    }

    try {
      if (!await TokenModel.invalidateAllAccessTokens(request.body.refresh)) {
        return response.fail('INVALID_TOKEN', 403)
      }

      let access = await TokenModel.generateAccessToken(request.body.refresh) 

      if (!access) {
        return response.fail('INVALID_TOKEN', 403)
      }
      
      response.success({ 
        access 
      })
    } catch (e) {
      response.fail(e.message)
    }
  }
}