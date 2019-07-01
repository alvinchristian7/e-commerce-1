const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('../helpers/hashPass')

function isEmail(email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  return emailRegex.test(email)
}

function isUnique(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then(row => {
        if (row)
          resolve(false)
        else
          resolve(true)
      })
      .catch(err => {
        reject(err)
      })
  })
}

let userSchema = new Schema({
  name: String,
  image_url: String,
  address: {
    type: String,
    required: true,
    minlength: [15, 'Please make sure the address information is clear enough!']
  },
  email: {
    type: String,
    validate: [
      { validator: isUnique, msg: props => `${props.value} has been taken!` },
      { validator: isEmail, msg: props => `${props.value} is not a valid email!` }
    ],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        if (password.length < 8)
          return false
        else
          return true
      },
      message: 'Password must be more than equal 8 character!'
    }
  },
  wallet: Number,
  cart: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    notes: String,
    totalCount: Number,
    totalPrice: Number,
  }],
  buyer_rating: {
    type: Number,
    max: [5, 'Rating max. 5 stars']
  },
  seller_rating: {
    type: Number,
    max: [5, 'Rating max. 5 stars']
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  if (this.isNew)
    this.password = bcrypt.hashSync(this.password)
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User