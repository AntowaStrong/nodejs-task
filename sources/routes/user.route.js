const express     = require('express')
const controllers = require('../controllers')

const router = express.Router()

router.get('/info', controllers.user.info)

module.exports = router