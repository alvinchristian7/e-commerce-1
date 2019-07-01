var chai = require('chai')
  , chaiHttp = require('chai-http')
  , expect = chai.expect
chai.use(chaiHttp);
const app = require('../app')
const User = require('../models/user')
// var agent = chai.request.agent(app)
const jwt = require('../helpers/jwt')
const clearAllDB = require('../helpers/deleteAllDB')
let user = {
  name: 'admin',
  role: 'admin',
  email: 'admin@mail.com',
  password: 'adminaja',
}
let token
let id = ""

describe("routes /product", function () {
  // this.timeout(3000);
  before('get token', function (done) {
    chai.request(app)
      .post('/user/register')
      .send(user)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        chai.request(app)
          .post('/user/login')
          .send(user)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            token = res.body["access-token"]
            done()
          });
      });
  })
  // before((done) => {
  //   User.findOne({ email: "admin@mail.com" })
  //     .then(row => {
  //       let payload = {
  //         _id: row._id,
  //         email: row.email,
  //         password: row.password,
  //       }
  //       token = jwt.sign(payload)
  //       // console.log(token, "access-token");
  //       done()
  //     })
  //     .catch(err => {
  //       // console.log(err, 'err');
  //       done(err)
  //     })
  // })
  it('create product berhasil (Admin only)', function (done) {
    let reqBody = {
      name: "Kapak",
      category: 'Perkakas',
      price: 50000,
      stock: 68,
    }
    chai.request(app)
      .post('/product')
      .set("access-token", token)
      .send(reqBody)
      .end(function (err, res) {
        console.log(res.body, "resbody")
        id = res.body._id
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });
  it('baca semua products berhasil', function (done) {
    chai.request(app)
      .get('/product')
      .set("access-token", token)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('baca satu product dari id berhasil /:id', function (done) {
    chai.request(app)
      .get(`/product/${id}`)
      .set("access-token", token)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('search products berhasil', function (done) {
    let query = "?name=Kapak"
    chai.request(app)
      .get(`/product${query}`)
      .set("access-token", token)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('update product berhasil', function (done) {
    let reqBody = {
      name: "aja",
      category: 'Baju',
      price: 10000,
      stock: 14,

    }
    chai.request(app)
      .put(`/product/${id}`)
      .set("access-token", token)
      .send(reqBody)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('delete product berhasil /:id', function (done) {
    chai.request(app)
      .delete(`/product/${id}`)
      .set("access-token", token)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  after('delete product', clearAllDB)
})