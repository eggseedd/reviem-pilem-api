const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')
const filmsRoutes = require('./routes/films')  

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Welcome to Review Pilem API")
})

app.use('/auth', authRoutes)

app.use('/films', filmsRoutes)

module.exports = app