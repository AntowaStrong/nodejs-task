const cors       = require('cors')
const express    = require('express')
const fileUpload = require('express-fileupload');

const app = express()

app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

module.exports = app