const app = require('./src/app')
const dotenv = require('dotenv')
const { poolPromise } = require('./src/config/db')

dotenv.config()
const port = process.env.PORT || 8080

poolPromise.then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error('Failed to start server, DB connection error:', err)
  })