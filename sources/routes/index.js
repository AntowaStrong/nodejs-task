const auth      = require('../middleware/auth.middleware')
const express   = require('express')
const fileRoute = require('./file.route')
const authRoute = require('./auth.route')
const userRoute = require('./user.route')

const router = express.Router()

router.use(authRoute)
router.use('/', auth, userRoute)
router.use('/file', auth, fileRoute)

router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router