const mysql = require('mysql')
const dotenv = require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT || 5432,
    database: process.env.MYSQL_DATABASE
})

connection.connect(error => {
    if (error) throw error
    else console.log('DB connected successfully')
})

module.exports = connection