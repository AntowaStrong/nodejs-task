process.env.NODE_ENV = 'test'

const chai           = require('chai')
const chaiHttp       = require('chai-http')
const { app, start } = require('../app')

chai.use(chaiHttp)

start()

const validCredentials = {
  id: 'user-test@e.mail',
  password: 'Passw0rd'
}

describe('*********** USER ***********', () => {
  describe('/GET /info', () => {
    it('info: valid', (done) => {
      let agent = chai.request(app)

      agent.post('/singup').send(validCredentials).end((err, res) => {
        agent.get('/info').chai.request(app) .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('id').equal(validCredentials.id)
          done() 
        })
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
})



