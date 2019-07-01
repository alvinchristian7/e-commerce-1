const User = require('../models/user')
const Product = require('../models/product')
const Transaction = require('../models/transaction')

function authCart(req, res, next) {
  User.findById(req.decoded._id)
    .then(row => {
      if (row) {
        if (row.cart.filter(produk => produk.product.equals(req.params._id))) {
          next()
        }
        else
          next({ code: 401, message: 'Unauthorized' })
      }
      else
        next({ code: 404, message: 'User not found' })
    })
    .catch(next)
}

function authProduct(req, res, next) {
  Product.findById(req.params._id)
    .then(row => {
      if (row) {
        if (row.seller.equals(req.decoded._id)) {
          next()
        }
        else
          next({ code: 401, message: 'Unauthorized' })
      }
      else
        next({ code: 404, message: 'Product not found' })
    })
    .catch(next)
}

function authTransaction(req, res, next) {
  Transaction.findById(req.params._id)
    .then(row => {
      if (row) {
        if (row.seller.equals(req.decoded._id) || row.buyer.equals(req.decoded._id)) {
          next()
        }
        else
          next({ code: 401, message: 'Unauthorized' })
      }
      else
        next({ code: 404, message: 'Transaction not found' })
    })
    .catch(next)
}

module.exports = {
  authCart,
  authProduct,
  authTransaction
}