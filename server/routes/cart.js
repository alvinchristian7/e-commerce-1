const router = require("express").Router()
const user = require('../controllers/user')
const { authCart } = require('../middlewares/authorize')
const Authenticate = require('../middlewares/authenticate')

router.post('/upsert/:_id', Authenticate, authCart, user.upsertCart)
router.get('/', Authenticate, authCart, user.readOne)
// router.put('/update/:_id', Authenticate, authCart, user.updateCart)
router.put('/delete/:_id', Authenticate, authCart, user.deleteCart)

module.exports = router