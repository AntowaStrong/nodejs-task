const express     = require('express')
const controllers = require('../controllers')

const router = express.Router()

router.post('/upload', controllers.file.upload)
router.get('/list', controllers.file.list)
router.delete('/delete/:id', controllers.file.delete)
router.get('/download/:id', controllers.file.download)
router.put('/update/:id', controllers.file.update)

module.exports = router