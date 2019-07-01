const router = require("express").Router()
const product = require('../controllers/product')
const { authProduct } = require('../middlewares/authorize')
const authenticate = require('../middlewares/authenticate')
const isAdmin = require('../middlewares/isAdmin')
const upload  = require('../middlewares/upload')
const gcs = require('../middlewares/GCS')

router.use(authenticate)
router.post('/', gcs.multer.single("image_url"), gcs.sendUploadToGCS, product.create)
router.get('/', product.read)
router.get('/:_id', authProduct, product.readOne)
router.patch('/favorite/:_id', product.update)
router.patch('/:_id', authProduct, gcs.multer.single("image_url"), gcs.sendUploadToGCS, product.update)
router.put('/:_id', authProduct, gcs.multer.single("image_url"), gcs.sendUploadToGCS, product.update)
router.delete('/:_id', authProduct, product.delete)

module.exports = router