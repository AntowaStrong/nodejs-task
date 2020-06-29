const auth        = require('../middleware/auth.middleware')
const express     = require('express')
const controllers = require('../controllers')

const router = express.Router()

router.get('/info', auth, controllers.user.info)

module.exports = router