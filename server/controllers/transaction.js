const Transaction = require('../models/transaction')
const User = require('../models/user')

class TransactionController {
  static create(req, res, next) {    
    let obj = {}
    let exclude = ['_id', '__v', 'createdAt', 'updatedAt']
    Transaction.schema.eachPath(path => {
      if (!exclude.includes(path)) {
        if (req.body[path])
          obj[path] = req.body[path]
      }
    })
    obj.buyer = req.decoded._id
    let row3
    Transaction.create(obj)
      .then(row => {
        row3 = row
        return User.findById(req.decoded._id)
      })
      .then(row1 =>{
        row1.cart = []
        return row1.save({ validateBeforeSave: false })
      })
      .then(row2 =>{
        res.status(201).json(row3)
      })
      .catch(next)
  }

  static read(req, res, next) {
    let obj = {}
    if (req.query.name)
      obj.name = { '$regex': req.query.name, '$options': 'i' }
    if (req.query.category)
      obj.category = req.query.category

    Transaction.find(obj)
    .populate('buyer')
    .populate('seller')
    .populate('products.product')
      .then(rows => {
        res.json(rows)
      })
      .catch(next)
  }

  static readOne(req, res, next) {
    Transaction.findById(req.params._id)
    .populate('buyer')
    .populate('seller')
    .populate('products.product')
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static update(req, res, next) {
    let obj = {}
    let exclude = ['image_url', '_id', '__v', 'createdAt', 'updatedAt']
    if(req.body.tags && typeof req.body.tags == 'string')
      req.body.tags = req.body.tags.split(',')
    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }

    if (req.method === "PATCH") {
      Transaction.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          if (req.body[path])
            obj[path] = req.body[path]
        }
      })
    }
    else {
      Transaction.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          obj[path] = req.body[path]
        }
      })
    }
    
    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }

    Transaction.findByIdAndUpdate(req.params._id, obj, { new: true })
    .populate('buyer')
    .populate('seller')
    .populate('products.product')
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Transaction.findByIdAndDelete(req.params._id)
    .populate('buyer')
    .populate('seller')
    .populate('products.product')
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }
}

module.exports = TransactionController