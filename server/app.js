if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const DB = process.env.NODE_ENV || 'e-commerce'
const url = `mongodb+srv://admin:admin@e-commerce-alvinchristian7-vyatv.gcp.mongodb.net/${DB}?retryWrites=true`
const port = process.env.PORT || 3000
const routes = require('./routes')
const error = require('./middlewares/error')

mongoose.connect(url, {
  useNewUrlParser: true,
  // useFindAndModify: false,
})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err)
  })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use("/", routes)

app.use(error)

app.listen(port, () => {
  console.log('Listening on port',port)
})

module.exports = app
