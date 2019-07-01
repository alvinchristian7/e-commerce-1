// const chai = require('chai')
var chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    clearAllDB = require('../helpers/deleteAllDB')
chai.use(chaiHttp);
const app = require('../app')

describe("/USER", function(){
  describe("routes /user/register", function () {
    it('register berhasil /register', function (done) {
      let reqBody = {
        name: "admin",
        role: 'admin',
        email: "admin@mail.com",
        password: "adminaja",
      }
      chai.request(app)
        .post('/user/register')
        .send(reqBody)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });
  
    it('format email salah /register', function (done) {
      let reqBody = {
        name: "Alvin",
        role: 'admin',
        email: "alvin",
        password: "alvin",
      }
      chai.request(app)
        .post('/user/register')
        .send(reqBody)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(`${reqBody.email} is not a valid email!, Password must be more than equal 8 character!`);
          done();
        });
    });
  })
  
  describe("routes /users/login", function () {
    it('login berhasil /login', function (done) {
      let reqBody = {
        email: "admin@mail.com",
        password: "adminaja",
      }
      chai.request(app)
        .post('/user/login')
        .send(reqBody)
        .end(function (err, res) {
          // expect(res).to.have.cookie('sessionid');
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          token = res.body.token
          done();
        });
    });
    // errornya HTTP 404 : "Email not found, please register first" kalau pake done()
    it('format email salah /login', function (done) {
      let reqBody = {
        email: "admin",
        password: "admin",
      }
      chai.request(app)
        .post('/user/login')
        .send(reqBody)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Wrong email/password');
          done()
        });
    });
    it('password salah /login', function (done) {
      let reqBody = {
        email: "admin@mail.com",
        password: "yuhu",
      }
      chai.request(app)
        .post('/user/login')
        .send(reqBody)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Wrong email/password');
          done()
        });
    });
    after('delete user',clearAllDB)
  })
})