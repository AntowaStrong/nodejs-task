const db            = require('../app/db')
const { MD5 }       = require('crypto-js')
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
      set: function (value) {
        this.setDataValue('password', MD5(value).toString())
      }
    }
  },
  {
    tableName: 'user',
    timestamps: false
  }
)

UserModel.prototype.checkPassword = function (password) {
  return this.password === MD5(password).toString()
}

module.exports = UserModel