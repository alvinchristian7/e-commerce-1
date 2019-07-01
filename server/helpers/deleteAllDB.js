const User = require('../models/user');
const Product = require('../models/product');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    User
      .deleteMany({})
      .then(function(){
        
        return Product
        .deleteMany({})
      })
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err)
      });
  }
};