const Product = require('../models/product')

class ProductController {
  static create(req, res, next) {
    let obj = {}
    let exclude = ['image_url', '_id', '__v', 'createdAt', 'updatedAt']
    if(req.body.tags && typeof req.body.tags == 'string')
      req.body.tags = req.body.tags.split(',')
    Product.schema.eachPath(path => {
      if (!exclude.includes(path)) {
        if (req.body[path])
          obj[path] = req.body[path]
      }
    })
    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }
    obj.seller = req.decoded._id
    Product.create(obj)
      .then(row => {
        res.status(201).json(row)
      })
      .catch(next)
  }

  static read(req, res, next) {
    let obj = {}
    if (req.query.name)
      obj.name = { '$regex': req.query.name, '$options': 'i' }
    if (req.query.category)
      obj.category = req.query.category
    if (req.query.seller)
      obj.seller = req.query.seller
    if (req.query.favorite)
      obj.favorite = req.query.favorite
      
    Product.find(obj)
      .then(rows => {
        res.json(rows)
      })
      .catch(next)
  }

  static readOne(req, res, next) {
    Product.findById(req.params._id)
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static update(req, res, next) {
    console.log(typeof req.body.changeFav);
    
    let obj = {}
    let exclude = ['favorite','image_url', '_id', '__v', 'createdAt', 'updatedAt']
    if(req.body.tags && typeof req.body.tags == 'string')
      req.body.tags = req.body.tags.split(',')
    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }

    if (req.method === "PATCH") {
      Product.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          if (req.body[path])
            obj[path] = req.body[path]
        }
      })
      if(req.body['changeFav'] == false){
        // obj['$set'] = {...obj}
        obj['$push'] = { favorite: req.decoded._id }
      }
      else if(req.body['changeFav'] == true) {
        // obj['$set'] = {...obj}
        obj['$pull'] = { favorite: req.decoded._id }
      }
    }
    else {
      Product.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          obj[path] = req.body[path]
        }
      })
    }
    
    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }

    Product.findByIdAndUpdate(req.params._id, obj, { new: true })
      .then(row => {
        console.log(row);
        
        res.json(row)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Product.findByIdAndDelete(req.params._id)
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }
}

module.exports = ProductController