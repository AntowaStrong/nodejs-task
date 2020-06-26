const { md5 }       = require('crypto-js')
const { FileModel } = require('../models')
const { map, has }  = require('lodash')
const path =  require('path')
var fs = require('fs')


const validateFile = (file) => {
  let types = []
  let size = null

  
  res = Joi.validate(file, Joi.object({
    size: Joi,
    mimetype: Joi
  }))

  return true
}

const validateID = () => {
  Joi.validate(request.params, Joi.object({
    id: Joi.number().required()
  }))

  return true
}

const getExtensionFromFIle = () => {

  
}

module.exports = {
  upload: async (request, response) => {
    let files = request.files
    let saved = []

    if (isEmpty(request.files)) {
      return response.status(400).json({
        success: false,
        error: 'No Files'
      })
    }

    try {
      saved = await Promise.all(map(files, 
        (file, name) => {

          return async () => {
            if (!validateFile(file)) {
              return { [name]: false }
            }

            let { name, size, mimetype: type } = file

            let extension = getExtensionFromFIle(name) 
            let hash      = md5((new Date()).getTime() + size + type + name)
            let path      = path.resolve(__dirname, '../public', hash + (extension ? '.' + extension : ''))

            try  {
              await file.mv(path)
            } catch (e) {
              return { [name]: false } 
            }

            try {
              await FileModel.create({
                name,
                path,
                type,
                size,
                extension
              })
            } catch (e) {
              return { [name]: false } 
            }

            return { [name]: true }
          }
        })
      )
    } catch (e) {
      return response.status(200).json({
        status: false,
        error: 'Something wronk'
      })
    }

    response.status(200).json({
      success: true,
      data: saved
    })
  },
  list: async (request, response) => {
    let { value: {page, list_size: size} } = Joi.validate(request.query, Joi.object({
      page: Joi.number().min(1).default(1).failover(1),
      list_size: Joi.number().min(1).max(10).default(10).failover(10)
    }))

    let files = []
    
    try {
      files = await FileModel.findAll({
        limit: size,
        offset: size * page,
        order: [
          ['id', 'ASC'],
        ]
      })
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'Bad'
      })
    }

    return response.status(200).json({
      success: true, 
      data: {
        files: map(files, file => file.get({ plain: true }))
      }
    })
  },
  delete: async (request, response) => {
    if (!validateID(request.params)) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }
    
    let file = null

    try {
      file = FileModel.findOne({
         id: request.params.id
       })
     } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    // check if file exist 
    try  {
      fs.unlinkSync(file.path)
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    try  {
      file.destroy()
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    response.status(400).json({
      success: true,
      data: []
    })
  },
  download: async (request, response) => {
    if (!validateID(request.params)) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    let file = null

    try {
     file = FileModel.findOne({
        id: request.params.id
      })
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    // check if file exist 
    response.download(file.path, file.name)
  },
  update: async (request, response) => {
    if (!validateID(request.params) || !validateFile(request.files.file)) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }
    
    let file = null

    try {
      file = FileModel.findOne({
        id: request.params.id
      })
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    let { name, size, mimetype: type } = request.files.file

    let extension = getExtensionFromFIle(name) 
    let hash      = md5((new Date()).getTime() + size + type + name)
    let path      = path.resolve(__dirname, '../public', hash + (extension ? '.' + extension : ''))

    try  {
      await request.files.file.mv(path)
    } catch (e) {
      return { [name]: false } 
    }

    try  {
      fs.unlinkSync(request.files.file.path)
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    file.name = name
    file.path = path
    file.type = type
    file.size = size
    file.extension = extension

    try  {
      await file.save()
    } catch (e) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }
    
    return response.status(200).json({
      success: true,
      data: []
    })
  }
}
