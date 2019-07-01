const router = require("express").Router()
const notification = require('../controllers/notification')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)
router.post('/',notification.create)
router.get('/',notification.read)

module.exports = router
