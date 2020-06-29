const db            = require('../app/db')
const moment        = require('moment')
const { md5 }       = require('crypto-js')
const { Sequelize } = require('sequelize')

const lifetime = 10 * 60 * 60 

const ACCESS_TOKEN = 0
const REFRESH_TOKEN = 1

let generateToken = (uid, type) => {
  return md5(uid + type + Date.now())
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
    timestamps: true,
    instanceMethods: {
      isRefresh: () => {
        return this.type === REFRESH_TOKEN
      }, 
      isAccess: () => {
        return this.type === ACCESS_TOKEN
      },
      validate: async () => {
        let now = moment.utc().format('X')
        let created = moment.utc(this.getDataValue('createdAt')).format('X')
        
        return created + lifetime > now
      },
      invalidate: async () => {
        this.valid = false

        try {
          await this.save()

          return true
        } catch (e) {
          return false
        }
      }
    },
    classMethods: {
      generateRefreshToken: async (uid) => {
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
      },
      generateAccessToken: async (refresh) => {
        let refresh = await this.findOne({
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
      },
      invalidateAllBelongsTokens: async (token) => {
        let token = await this.findOne({ 
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
          refresh.invalidate
        ]

        each(tokens, (token) => {
          invalidate.push(token.invalidate)
        })

        await Promise.allSettled(invalidate)

        return true
      },
      invalidateAllAccessTokens: async (token) => {
        let token = await this.findOne({ token })

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
          invalidate.push(token.invalidate)
        })

        await Promise.allSettled(invalidate)

        return true
      }
    }
  }
)

module.exports = TokenModel