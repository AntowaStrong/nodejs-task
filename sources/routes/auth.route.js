const auth        = require('../middleware/auth.middleware') 
const express     = require('express')
const controllers = require('../controllers')

const router = express.Router()

router.post('/signin', controllers.auth.login)
router.post('/logout', auth, controllers.auth.logout)
router.post('/singup', controllers.auth.logup)
router.post('/signin/new_token', controllers.auth.refresh)

module.exports = router