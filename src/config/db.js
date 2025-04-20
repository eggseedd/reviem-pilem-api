const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString:
      'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=review-pilem;Trusted_Connection=yes;',
    driver: 'msnodesqlv8'
  }

const poolPromise = sql.connect(config)
    .then(pool => {
    console.log('Connected to MSSQL using Windows Authentication')
    return pool
    })
    .catch(err => {
    console.error('Connection failed:', err)
    })

module.exports = {
  sql, poolPromise
}
