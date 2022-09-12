const Pool  = require("pg").Pool

const pool = new Pool({
    host: "localhost",
    user: "murkov",
    port: "5432",
    password: "Troublesome96!",
    database: "postgres"
})

pool.connect()

pool.on('connect', () => {
    console.log('connected to the db');
  });



module.exports = {
    pool
}