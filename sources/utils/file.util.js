const fs            = require('fs')
const path          = require('path')
const { directory } = require('../config')

module.exports = {
  buildPath: () => {
    args = [...arguments]

    args.shift(directory)

    return path.resolve(...args)
  },
  fileExist: async (path) => {
    try {
      return fs.existsSync(path)
    } catch(e) {
      return false
    }
  },
  removeFile: (path) => {
    if (!fileExist(path)) {
      return false
    }
  
    try  { 
      fs.unlinkSync(path)
  
      return true
    } catch (e) {
      return false
    }
  }
}