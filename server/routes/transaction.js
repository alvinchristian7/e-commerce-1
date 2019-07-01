const router = require("express").Router()
const transaction = require('../controllers/transaction')
const { authTransaction } = require('../middlewares/authorize')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)
router.post('/', transaction.create)
router.get('/', transaction.read)
router.get('/:_id', authTransaction, transaction.readOne)
router.patch('/:_id', authTransaction, transaction.update)
router.put('/:_id', authTransaction, transaction.update)
router.delete('/:_id', authTransaction, transaction.delete)

module.exports = router