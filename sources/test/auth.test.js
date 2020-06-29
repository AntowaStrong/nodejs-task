process.env.NODE_ENV = 'test'

const chai           = require('chai')
const chaiHttp       = require('chai-http')
const { app, start } = require('../app')

chai.use(chaiHttp)

start()

const validCredentials = {
  id: 'auth-test@e.mail',
  password: 'Passw0rd'
}

const tokens = {
  access: null,
  refresh: null,
}

describe('*********** AUTH ***********', () => {
  describe('/POST /singup', () => {
    it('Logup: valid', (done) => {
      chai
        .request(app)
        .post('/singup')
        .send(validCredentials)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.data.should.have.property('token')
          res.body.data.should.have.property('refresh')

          tokens.access  = res.body.data.token
          tokens.refresh = res.body.data.refresh

          done()
      })
    })
  })

  describe('/POST /signin', () => {
    it('Login: valid', (done) => {
      chai
        .request(app)
        .post('/signin')
        .send(validCredentials)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.data.should.have.property('token')
          res.body.data.should.have.property('refresh')

          tokens.access  = res.body.data.token
          tokens.refresh = res.body.data.refresh

          done()
      })
    })
  })

  describe('/POST /signin/new_token', () => {
    it('Refresh: valid', (done) => {
      chai
        .request(app)
        .post('/signin/new_token')
        .send 
     
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.data.should.have.property('refresh')

          tokens.access = res.body.data.token

          done()
      })
    })
  })

  describe('/POST /logout', () => {
    it('Logout: valid.', (done) => {
      chai
        .request(app)
        .post('/logout')
        .set('Authorization', 'Bearer ' + tokens.access) 
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data').eql('OK')
          
          done()
      })
    })
  })
})



