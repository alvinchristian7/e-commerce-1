const User = require('../models/user')
const Product = require('../models/product')
const jwt = require('../helpers/jwt')
const bcrypt = require('../helpers/hashPass')
const randomPass = require('../helpers/randomPass')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static upsertCart(req, res, next) {
    console.log(req.decoded.name)
    console.log(req.decoded._id)
    Promise.all([User.findOne({ 'cart.product': req.params._id }), Product.findById(req.params._id)])
      .then(results => {
        if (results[1].stock - req.body.count >= 0) {
          results[1].stock -= req.body.count
          results[1].save()
        }
        else {
          throw 'melebihi batas stok'
        }
        if (!results[0]) {
          let cart = {
            product: req.params._id,
            totalCount: req.body.count,
            totalPrice: results[1].price * req.body.count
          }
          return User.findOneAndUpdate({
            _id: req.decoded._id
          }, {
              $push: { cart: cart }
            })
        }
        else {
          console.log('sini nih')
          return User.findOneAndUpdate({
            _id: req.decoded._id,
            'cart.product': req.params._id
          }, {
              $inc: {
                'cart.$.totalCount': req.body.count, 'cart.$.totalPrice': results[1].price * req.body.count,
              }
            })
        }
      })
      .then((row) => {
        console.log(row)
        res.status(201).json(row)
      })
      .catch(next)
  }

  // static read(req, res, next) {
  //   User.findById(req.decoded._id)
  //   .populate('cart.product')
  //     .then(rows => {
  //       console.log(rows)
  //       res.status(200).json(rows)
  //     })
  //     .catch(next)
  // }

  static deleteCart(req, res, next) {
    Promise.all([User.findOne({ 'cart.product': req.params._id }), Product.findById(req.params._id)])
      .then(results => {
        results[1].stock += req.body.count
        results[1].save()
        return User.findOneAndUpdate({
          _id: req.decoded._id
        }, {
            $pull: { cart: { product: req.params._id } },
          })
      })
      .then((row) => {
        res.status(200).json(row)
      })
      .catch(next)
    // User.update({
    //   _id: req.decoded._id,
    // }, { $pull: { cart: { product: req.params._id } } })
    //   .then(row => {
    //     res.status(200).json(row)
    //   })
    //   .catch(err => {
    //     res.status(500).json({
    //       message: 'gak bisa bang'
    //     })
    //   })
  }

  static emptyCart(req, res, next){
    User.findById(req.decoded._id)
    .then(row =>{
      row.cart = []
      row.save({ validateBeforeSave: false })
      .then(row1 =>{
        res.json(row1)
      })
      .catch(next)
    })
  }

  static GoogleSignIn(req, res, next) {
    let payload = null
    let newPass = null
    let code = 500
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
      .then((ticket) => {
        payload = ticket.getPayload();
        const userid = payload['sub']
        return User.findOne({ email: payload.email })
      })
      .then((row) => {
        if (!row) {
          code = 201
          newPass = randomPass()
          return User.create({
            name: payload.name,
            email: payload.email,
            password: newPass
          })
        }
        code = 200
        return row
      })
      .then(row => {
        payload = {
          _id: row._id,
          name: row.name,
          role: row.role,
          email: row.email
        }
        let data = {
          'access-token': jwt.sign(payload)
        }
        if (newPass) data.newPass = newPass
        res.status(code).json(data)
      })
      .catch(next)
  }

  static register(req, res, next) {
    let exclude = ['image_url', '__v', 'createdAt', 'updatedAt']
    let obj = {}
    if(req.file)
    obj.image_url = req.file.cloudStoragePublicUrl
    
    User.schema.eachPath(path => {
      if (!exclude.includes(path)) {
        if (req.body[path])
        obj[path] = req.body[path]
      }
    })
    
    User.create(obj)
      .then(row => {        
        res.status(201).json(row)
      })
      .catch(next)
  }

  static login(req, res, next) {
    User.findOne({
      email: req.body.email,
    })
      .then(row => {
        if (row) {
          let isSame = bcrypt.compareSync(req.body.password, row.password)
          if (isSame) {
            let payload = {
              _id: row._id,
              name: row.name,
              email: row.email,
              image_url: row.image_url
            }
            let token = jwt.sign(payload)
            console.log(token);
            
            res.status(200).json({
              'access-token': token,
            })
          }
          else next({ code: 422, message: 'Wrong email/password' })
        }
        else
          next({ code: 422, message: 'Wrong email/password' })
      })
      .catch(next)
  }

  static readOne(req,res,next) {
    User.findById(req.decoded._id)
    .populate({
      path: 'cart.product',
      populate: { path: 'seller' }
    })
    .then(row =>{
      row = row.toObject()
      delete row.password
      console.log(JSON.stringify(row, null, 2));
      
      res.json(row)
    })
    .catch(next)
  }

  static update(req, res, next) {
    let obj = {}
    let exclude = ['image_url', '_id', '__v', 'createdAt', 'updatedAt']

    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }

    if (req.method === "PATCH") {
      User.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          if (req.body[path])
            obj[path] = req.body[path]
        }
      })
    }
    else {
      User.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          obj[path] = req.body[path]
        }
      })
    }

    User.findByIdAndUpdate(req.decoded._id, obj, { new: true })
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }
}

module.exports = UserController