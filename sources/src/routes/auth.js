const express = require('express')

const router = express.Router()

// // /signin [POST] - запрос bearer токена по id и паролю;
router.post('/signin', () => {
  
})

// /signin/new_token [POST]  - обновление bearer токены по refresh токену
router.post('/signin/new_token', () => {
  
})

// /signup [POST] - р
router.post('/singup',  async () => {
  // new user
})

// /logout [GET] - выйти из системы
router.post('/logout', async () => {
  //invalidate token;
})



module.exports = router


