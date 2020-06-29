const Joi                       = require('@hapi/joi') 
const { FileModel }             = require('../models')
const { map, has, isUndefined } = require('lodash')

const validateFile = (parameters) => {
  let size = 100 * 1000000 
  let types = []

  let type = Joi.string().valid(...types).required()

  let scheme = Joi.object({
    size: Joi.number().max(size).required(),
    mimetype: isEmpty(types) ? type : type.valid(...types)
  })

  return isUndefined(scheme.validate(parameters))
}

const validateID = (parameters) => {
  let scheme = Joi.object({
    id: Joi.number().required()
  })

  return isUndefined(scheme.validate(parameters).error)
}

module.exports = {
  upload: async (request, response) => {
    if (!has(request.files, 'file') || !validateFile(file)) {
      return response.fail('WRONG_PARAMETERS')
    }

    try {
      let file = await FileModel.storeFile(request.files.file)

      if (!file) {
        return response.fail('FILE_CANT_BE_SAVED')
      }

      response.success()
    } catch (e) {
      return response.fail()
    }
  },
  list: async (request, response) => {
    let { value: {page, list_size: size} } = Joi.validate(request.query, Joi.object({
      page: Joi.number().min(1).default(1).failover(1),
      list_size: Joi.number().min(1).max(10).default(10).failover(10)
    }))
    
    try {
      let files = await FileModel.findAll({
        limit: size,
        offset: size * page,
        order: [
          ['id', 'ASC'],
        ]
      })

      response.success({
        files: map(files, file => file.format())
      })
    } catch (e) {
      return response.fail()
    }
  },
  delete: async (request, response) => {
    if (!validateID(request.params)) {
      return response.fail('WRONG_PARAMETERS')
    }

    try {
      let file = FileModel.findOne({
        id: request.params.id
      })

      if (!file) {
        response.fail('FILE_NOT_FOUND')
      }

      file.destroy()

      response.success()

     } catch (e) {
      return response.fail()
    }
  },
  download: async (request, response) => {
    if (!validateID(request.params)) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }

    try {
      let file = await FileModel.findOne({
        id: request.params.id
      })

      if (!file || !file.fullpath()) {
        response.fail('FILE_NOT_FOUND')
      }

      response.download(file.fullpath(), file.name)
    } catch (e) {
      return response.fail()
    }
  },
  update: async (request, response) => {
    if (!validateID(request.params)) {
      return response.status(400).json({
        success: false,
        error: 'text'
      })
    }
    
    if (!has(request.files, 'file') || !validateFile(file)) {
      response.fail('FILE_NOT_FOUND')
    }

    try {
      let file = await FileModel.updateFile({ id: request.params.id }, request.files.file)

      if (!file) {
        response.fail('FILE_CANT_BE_UPDATED')
      }

      response.success()
    } catch (e) {
      return response.fail()
    }
  }
}
