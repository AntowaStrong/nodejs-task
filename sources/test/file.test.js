process.env.NODE_ENV = 'test'

const chai           = require('chai')
const chaiHttp       = require('chai-http')
const { app, start } = require('../app')

chai.use(chaiHttp)

start()

const validCredentials = {
  id: 'file-test@e.mail',
  password: 'Passw0rd'
}

let files = []

describe('*********** FILE ***********', () => {
  chai.request(app).post('/singup').send(validCredentials).end(function (err, res) {

    describe('/POST /upload', () => {
      it('Upload: valid', (done) => {
        chai
          .request(app)
          .post('/upload')
          .attach('file', './assets/test-1.img', 'test-1.img')
          .set('Authorization', 'Bearer ' + res.body.token)
          .end((err, res) => {
            res.should.have.status(200)
           
            done()
        })
      })
    })

    describe('/GET /list', () => {
      it('List: valid', (done) => {
        chai
          .request(app)
          .get('/list')
          .set('Authorization', 'Bearer ' + res.body.token)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('array')

            files = res.body.data.files
           
            done()
        })
      })
    })

    describe('/PUT /update', () => {
      it('Update: valid', (done) => {
        chai
          .request(app)
          .put('/update/' + files[0].id)
          .attach('file', './assets/test-2.img', 'test-2.img')
          .set('Authorization', 'Bearer ' + res.body.token)
          .end((err, res) => {
            res.should.have.status(200)

            done()
        })
      })
    })

    describe('/POST /download', () => {
      it('Download: valid', (done) => {
        chai
          .request(app)
          .get('/download/' + files[0].id)
          .set('Authorization', 'Bearer ' + res.body.token)
          .end((err, res) => {
            res.should.have.status(200)

            done()
        })
      })
    })

    describe('/DELETE /delete', () => {
      it('Delete: valid.', (done) => {
        chai
          .request(app)
          .delete('/delete/' + files[0].id)
          .set('Authorization', 'Bearer ' + res.body.token)
          .end((err, res) => {
            res.should.have.status(200)

            done()
        })
      })
    })
  })
})

