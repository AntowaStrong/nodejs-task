process.env.NODE_ENV = 'test'

const chai           = require('chai')
const should         = chai.should()
const { each }       = require('lodash')
const chaiHttp       = require('chai-http')
const { UserModel }  = require('../models')
const { app, start } = require('../app')

chai.use(chaiHttp)

start()

const validCredentials = {
  id: 'user-test@e.mail',
  password: 'Passw0rd'
}

const tokens = {
  access: null
} 

describe('*********** USER ***********', () => {
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

  describe('/GET /info', () => {
    it('info: valid', (done) => {   
      chai
        .request(app)
        .get('/info')
        .set('Authorization', 'Bearer ' + tokens.access)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.data.should.have.property('id').equal(validCredentials.id)

          done() 
        })
    })

    it('info: invalid', (done) => {
      chai
        .request(app)
        .get('/info')
        .end((err, res) => {
          res.should.have.status(403)
          res.body.should.be.a('object')
          res.body.should.have.property('success').equal(false)
          done() 
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



