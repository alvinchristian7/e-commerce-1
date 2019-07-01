const mongoose = require('mongoose')
const Schema = mongoose.Schema

let transactionSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    notes: String,
    totalCount: Number,
    totalPrice: Number,
  }],
  status: {
    type: String,
    default: 'Waiting for seller to send package(s)'
  },
  confirmation: {
    type: String,
    default: 'seller'
  },
  subTotal: Number,
}, { timestamps: true })

transactionSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.seller.equals(this.buyer))
      next({ code: 400, message: "You can't buy from yourself!" })
    else
      next()
  }
  else
    next()
})

let Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction