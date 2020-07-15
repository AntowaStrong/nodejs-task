const fs            = require('fs')
const path          = require('path')
const { directory } = require('../config')

let fileExist = async (path) => {
  try {
    return await fs.exists(path)
  } catch(e) {
    return false
  }
}

module.exports = {
  fileExist,
  buildPath: function () {
    let args = [...arguments]

    args.unshift(directory)

    return path.resolve(...args)
  },
  removeFile: async (path) => {
    if (!await fileExist(path)) {
      return false
    }
  
    try  { 
      await fs.unlink(path)
  
      return true
    } catch (e) {
      return false
    }
  }
}