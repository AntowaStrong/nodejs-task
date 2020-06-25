const express = require('express')

const router = express.Router()

// /file/upload [POST] - добавление нового файла в систему и запись параметров файла в базу (название, расширение, MIME type, размер, дата загрузки
router.post('/upload', async (request, response) => {
//   request.
//   // check if file exist 




//   response.send() 
})

// /file/list [GET]  выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанного в передаваемом параметре list_size, по умолчанию 10 записей на страницу, если параметр пустой. Номер страницы указан в параметре page, по умолчанию 1, если не задан. 
router.get('/list', async (request, response) => {

//   Joi.object
response.status(400).json({
    errors: {
        msg: 'list'
    }
}) 
})

// /file/delete/:id [DELETE] - удаляет документ из базы и локального хранилища
router.delete('/delete/:id', async () => {

  


})

// /file/download/:id [GET] - скачивание конкретного файла. 
router.get('/download/:id', () => {



})

// /file/update/:id [PUT] - обновление текущего документа на новый в базе и локальном хранилище
router.put('/update/:id', () => { 


})

module.exports = router



