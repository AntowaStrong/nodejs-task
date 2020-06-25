const db            = require('../../bootstrap/db')
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
    }
  },
  {
    tableName: 'user',
    timestamps: false,
  }
)

module.exports = UserModel