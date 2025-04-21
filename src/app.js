const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')
const filmsRoutes = require('./routes/films')
const genresRoutes = require('./routes/genres')
const reviewsRoutes = require('./routes/reviews')  
const userRoutes = require('./routes/user')
const { swaggerUi, swaggerDocs } = require("./swagger")

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Welcome to Review Pilem API. Please visit /api-docs for documentation.")
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(swaggerDocs)
})

app.use('/auth', authRoutes)

app.use('/films', filmsRoutes)

app.use('/genres', genresRoutes)

app.use('/reviews', reviewsRoutes)

app.use('/user', userRoutes)

module.exports = app