const Notification = require('../models/notification')

class NotificationCont {
  static create(req, res, next) {
    let obj = {}
    let exclude = ['image_url', '_id', '__v', 'createdAt', 'updatedAt']
    Notification.schema.eachPath(path => {
      if (!exclude.includes(path)) {
        if (req.body[path])
          obj[path] = req.body[path]
      }
    })
    if (req.file) {
      obj.image_url = req.file.cloudStoragePublicUrl
    }
    obj.user = req.decoded._id
    Notification.create(obj)
      .then(row => {
        res.status(201).json(row)
      })
      .catch(next)
  }

  static read(req, res, next) {
    Notification.find({ user: req.decoded._id })
      .then(rows => {
        console.log(rows);
        
        res.json(rows)
      })
      .catch(next)
  }
}

module.exports = NotificationCont