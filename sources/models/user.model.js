const db            = require('../app/db')
const { md5 }       = require('crypto-js')
const { Sequelize } = require('sequelize')

const UserModel = db.define('User', 
  {
    uid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: Sequelize.STRING(322), // https://tools.ietf.org/html/rfc3696 (page 6, section 3)
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(32),
      allowNull: false,
      set: () => {
        this.setDataValue('name', md5(password))
      }
    }
  },
  {
    tableName: 'user',
    timestamps: false,
    instanceMethods: {
      checkPassword: (password) => {
        return this.password === md5(password)
      }
    }
  }
)

module.exports = UserModel