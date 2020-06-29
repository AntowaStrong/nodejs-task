const auth      = require('../middleware/auth.middleware')
const express   = require('express')
const fileRoute = require('./file.route')
const authRoute = require('./auth.route')
const userRoute = require('./user.route')

const router = express.Router()

router.use((request, response, next) => {
  response.success = (data = 'OK', code = 200) => {
    response.status(code).json({
      success: true,
      data: data,
      error: null
    })
  }

  response.fail = (message = 'SOMETHING_WRONG', code = 400) => {
    response.status(code).json({
      success: false,
      data: null,
      error: message
    })
  }

  next()
})

router.use(authRoute)
router.use('/', userRoute)
router.use('/file', auth, fileRoute)

router.use('*', (request, response) => {
  response.fail('URL_NOT_FOUND')
})

module.exports = router