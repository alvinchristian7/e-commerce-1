const User = require('../models/user')

module.exports = (req, res, next) => {
  User.findById(req.decoded._id)
  .then(row =>{
    if(row.role === 'admin'){
      next()
    }
    else
      next({ code: 401, message: 'Admin only' })
  })
  .catch(next)
}