const mongoose = require('mongoose')
const Schema = mongoose.Schema

let productSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  favorite: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
  },
  image_url: {
    type: String,
    default: 'https://via.placeholder.com/500'
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    max: [5, 'Rating max. 5 stars']
  }
},{timestamps: true})

let Product = mongoose.model('Product', productSchema)

module.exports = Product