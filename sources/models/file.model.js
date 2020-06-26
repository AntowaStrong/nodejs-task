const db            = require('../app/db')
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
    timestamps: true,
    instanceMethods: {
      getContent: () => {
        
      }
    }
  }
)

module.exports = FileModel