
const db                                   = require('../app/db')
const { MD5 }                              = require('crypto-js')
const { isNull }                           = require('lodash')
const { Sequelize, Model }                 = require('sequelize')
const { getExtensionFromFIle }             = require('../utils')
const { buildPath, fileExist, removeFile } = require('../utils/file.util')

let store = async (model, file) => {
  let { name, size, mimetype: type } = file

  let extension = getExtensionFromFIle(name) 
  let hash      = MD5((new Date()).getTime() + size + type + name).toString()
  let path      = 'public/' + hash + (extension ? '.' + extension : '')
  let fullpath  = buildPath(path)
 
  try {
    if (model.fullpath()) {
      removeFile(model.fullpath()) 
    }

    await file.mv(fullpath) 

    model.set({
      mame,
      path,
      type, 
      size,
      extension
    })

    await model.save()

    return model
  } catch (e) {
    return null
  }
}

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
    hooks: {
      beforeDestroy: function () {
        if (isNull(this.path)) {
          removeFile(this.path)
        }
      }
    }
  }
)

FileModel.storeFile = async function (file) {
  return store(this.build(), file)
}

FileModel.updateFile = async function (model, file) {
  model = await this.resolveModel(model)

  if (!model) {
    return null
  }

  return store(model, file)
},

FileModel.resolveModel = async function (model) {
  if (model instanceof Model) {
    return model
  }  

  return await this.findOne(model)
}

FileModel.prototype.fullpath = function () {
  if (!this.path) {
    return null
  }

  let realPath = buildPath(this.path)

  return fileExist(realPath) ? realPath : null
}

FileModel.prototype.format = function () {
  return {
    id: this.id,
    name: this.name,
    type: this.type,
    size: this.size,
    extension: this.extensions
  }
}

module.exports = FileModel