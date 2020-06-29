const db            = require('../app/db')
const moment        = require('moment')
const { MD5 }       = require('crypto-js')
const { each }      = require('lodash')
const { Sequelize } = require('sequelize')

const lifetime = 10 * 60 * 60 

const ACCESS_TOKEN = 0
const REFRESH_TOKEN = 1

let generateToken = (uid, type) => {
  return MD5(uid + type + Date.now() + '').toString() 
}

const TokenModel = db.define('Token', 
  {
    id: {   
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    belong: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    valid: { 
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1 
    } 
  }, 
  {
    tableName: 'token',
    timestamps: true
  }
)

TokenModel.generateRefreshToken = async function (uid) {
  let token = generateToken(uid, REFRESH_TOKEN)

  let model = await this.create({ 
    uid: uid,
    type: REFRESH_TOKEN,
    token: token
  })

  if (!model) {
    return null
  }

  return token
}

TokenModel.generateAccessToken = async function (refresh) {
  refresh = await this.findOne({
    where: { 
      type: REFRESH_TOKEN,
      valid: true,
      token: refresh
    }
  })

  if (!refresh) {
    return null 
  } 

  let token = generateToken(refresh.uid, ACCESS_TOKEN)

  let model = await this.create({ 
    uid: refresh.uid,
    type: ACCESS_TOKEN,
    token: token,
    belong: refresh.id
  })

  if (!model) {
    return null
  }

  return token
}

TokenModel.invalidateAllBelongsTokens = async function (token) {
  token = await this.findOne({ 
    where: { 
      token: token,
      valid: true
    }
  })

  if (!token) {
    return false
  }

  let refresh = token 

  if (refresh.isAccess()) {
    refresh = await this.findOne({
      where: { 
        id: refresh.belong,
        valid: true
      }
    })
  }

  if (!refresh) {
    return false
  }

  let tokens = await this.findAll({ 
    where: {
      type: ACCESS_TOKEN,
      valid: true,
      belong: token.isRefresh() ? token.id : token.belong
    }
  }) 

  let invalidate = [
    refresh.invalidate()
  ]

  each(tokens, (token) => {
    invalidate.push(token.invalidate())
  })

  await Promise.allSettled(invalidate)

  return true
}

TokenModel.invalidateAllAccessTokens = async function (token) {
  token = await this.findOne({
    where: {
      token: token,
      valid: true
    }
  })

  if (!token) {
    return false
  }

  let tokens = await this.findAll({ 
    where: {
      type: ACCESS_TOKEN,
      valid: true,
      belong: token.isRefresh() ? token.id : token.belong
    }
  }) 

  let invalidate = []

  each(tokens, (token) => {
    invalidate.push(token.invalidate())
  })

  await Promise.allSettled(invalidate)

  return true
}

TokenModel.prototype.isRefresh = function () {
  return this.type === REFRESH_TOKEN
}

TokenModel.prototype.isAccess = function () {
  return this.type === ACCESS_TOKEN
}

TokenModel.prototype.valide = function () {
  let now = parseInt(moment.utc().format('X'))
  let created = parseInt(moment.utc(this.getDataValue('createdAt')).format('X'))
  
  return this.valid && created + lifetime > now
}

TokenModel.prototype.invalidate = async function () {
  this.valid = false

  try {
    await this.save()

    return true
  } catch (e) {
    return false
  }
}

module.exports = TokenModel