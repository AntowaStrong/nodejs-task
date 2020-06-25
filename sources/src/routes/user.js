const express = require('express')

const router = express.Router()

router.get('/info', async (request, response) => {
//   // user from token 
//   req.user 

        response.status(400).json({
        errors: {
            msg: 'info'
        }
    }) 
})

module.exports = router