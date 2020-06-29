const fs            = require('fs')
const path          = require('path')
const { directory } = require('../config')

let fileExist = (path) => {
  try {
    return fs.existsSync(path)
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