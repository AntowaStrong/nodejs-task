const db            = require('../../bootstrap/db')
const { Sequelize } = require('sequelize')

const FileModel = db.define('File', 
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    path: Sequelize.STRING,
    type: Sequelize.STRING,
    size: Sequelize.STRING,
    extension: Sequelize.STRING
  },
  {
    tableName: 'file',
    timestamps: true
  }
)

module.exports = FileModel