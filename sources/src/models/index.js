const db = require('../../bootstrap/db')

const UserModel  = require('./user')
const FileModel  = require('./file')
// const TokenModel = require('./token')

// UserModel.hasMany(TokenModel, { foreignKey: 'uid' })

db.authenticate()
  .then(() => {
    console.info('Connection to MySQL has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = {
  UserModel,
  FileModel,
  // TokenModel
}
