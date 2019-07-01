const router = require("express").Router()
const product = require('./product')
const transaction = require('./transaction')
const notification = require('./notification')
const user = require("./user")
const cart = require("./cart")

router.get("/", (req, res) => {
  res.status(200).json({ message: 'API connected' })
})

router.use("/product", product)
router.use("/transaction", transaction)
router.use("/notification", notification)
router.use("/user", user)
router.use("/cart",cart)

module.exports = router