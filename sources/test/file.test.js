process.env.NODE_ENV = 'test'

const chai                      = require('chai')
const path                      = require('path')
const should                    = chai.should()
const { MD5 }                   = require('crypto-js')
const { each }                  = require('lodash')
const chaiHttp                  = require('chai-http')
const { app, start }            = require('../app')
const { UserModel, FileModel }  = require('../models')

chai.use(chaiHttp)

start()

const validCredentials = {
  id: 'file-test@e.mail',
  password: 'Passw0rd'
}

const tokens = {
  access: null
} 

const filename = MD5('filetest' + (new Date()).getTime()).toString() + '.jpeg'

describe('*********** FILE ***********', () => {
  before(() => {
    return new Promise((resolve) => {
      chai
        .request(app)
        .post('/singup')
        .send(validCredentials)
        .end((err, res) => {
          tokens.access = res.body.data.access 

          resolve()
        })
    })
  })

  it('AUTH TEST', (done) => {
    chai
      .request(app)
      .get('/file/list')
      .end((err, res) => {
        res.should.have.status(403)
        
        done()
    })
  })

  describe('/POST /file/upload', () => {
    it('Upload: valid', (done) => {
      chai
        .request(app)
        .post('/file/upload')
        .attach('file', path.resolve(__dirname, './assets/test-1.jpeg'), filename)
        .set('Authorization', 'Bearer ' + tokens.access)
        .end((err, res) => {
          res.should.have.status(200)
          
          done()
      })
    })
  })

  describe('/GET /file/list', () => {
    it('List: valid', (done) => {
      chai
        .request(app)
        .get('/file/list')
        .set('Authorization', 'Bearer ' +  tokens.access)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          
          done()
      })
    })
  })

  describe('/PUT /file/update', () => {
    it('Update: valid', (done) => {
      FileModel.findOne({
        where: {
          name: filename
        }
      }).then((file) => {
        chai
          .request(app)
          .put('/file/update/' + file.id)
          .attach('file', path.resolve(__dirname, './assets/test-2.jpeg'), filename)
          .set('Authorization', 'Bearer ' +  tokens.access)
          .end((err, res) => {
            res.should.have.status(200)

            done()
        })
      })
    })
  })

  describe('/POST /file/download', () => {
    it('Download: valid', (done) => {
      FileModel.findOne({
        where: {
          name: filename
        }
      }).then((file) => {
        chai
          .request(app)
          .get('/file/download/' + file.id)
          .set('Authorization', 'Bearer ' +  tokens.access)
          .end((err, res) => {
            res.should.have.status(200)

            done()
        })
      })
    })
  })

  describe('/DELETE /file/delete', () => {
    it('Delete: valid.', (done) => {
      FileModel.findOne({
        where: {
          name: filename
        }
      }).then((file) => {
        chai
          .request(app)
          .delete('/file/delete/' + file.id)
          .set('Authorization', 'Bearer ' +  tokens.access)
          .end((err, res) => {
            console.log(res.text)
            res.should.have.status(200)

            done()
        })
      })
    })
  })

  after(async () => {
    try {
      let users = await UserModel.findAll({ 
        where: {
          id: validCredentials.id
        }
      })

      let remove = []

      each(users, (user) => {
        remove.push(user.destroy())
      })

      await Promise.allSettled(remove)
    } catch (e) {
      console.log(e)
    }
  })
})

