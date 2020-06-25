const file    = require('./file')
const auth    = require('./auth')
const user    = require('./user')
const express = require('express')

const router = express.Router()

router.use(auth)
router.use(user)
router.use('/file', file)

router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router