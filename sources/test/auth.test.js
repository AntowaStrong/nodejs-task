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
  id: 'auth-test@e.mail',
  password: 'Passw0rd'
}

const tokens = {
  old: null,
  access: null,
  refresh: null
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
          res.body.data.should.have.property('access')
          res.body.data.should.have.property('refresh')
          res.body.data.access.should.be.a('string')
          res.body.data.refresh.should.be.a('string')

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
          res.body.data.should.have.property('access')
          res.body.data.should.have.property('refresh')
          res.body.data.access.should.be.a('string')
          res.body.data.refresh.should.be.a('string')

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
        .send({ refresh: tokens.refresh })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.data.should.have.property('access')
          res.body.data.access.should.be.a('string')

          tokens.old    = tokens.access  
          tokens.access = res.body.data.access

          done()
      })
    })

    it('Refresh: check old access token after refresh', (done) => {
      chai
        .request(app)
        .get('/info')
        .set('Authorization', 'Bearer ' + tokens.old) 
        .send({ refresh: tokens.refresh })
        .end((err, res) => {
          res.should.have.status(403)

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

    it('Logout: Check access token after logout', (done) => {
      chai
        .request(app)
        .get('/info')
        .set('Authorization', 'Bearer ' + tokens.access) 
        .end((err, res) => {
          res.should.have.status(403)

          done()
      })
    })

    it('Logout: Check refresh token after logout', (done) => {
      chai
        .request(app)
        .post('/signin/new_token')
        .send({ refresh: tokens.refresh })
        .end((err, res) => {
          console.log(res.text)
          res.should.have.status(403)

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



