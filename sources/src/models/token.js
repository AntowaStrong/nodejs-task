const db            = require('../../bootstrap/db')
const { Sequelize } = require('sequelize')

const TokenModel = db.define('Token', 
  // {
  //   id: {
  //     type: Sequelize.INTEGER,
  //     primaryKey: true,
  //     autoIncrement: true,
  //   },
  //   name: Sequelize.STRING,
  //   path: Sequelize.STRING,
  //   type: Sequelize.STRING,
  //   size: Sequelize.STRING,
  //   extension: Sequelize.STRING
  // },
  // {
  //   tableName: 'token',
  //   timestamps: true
  // }
)

module.exports = TokenModel