require('dotenv').config({path:__dirname+"/../.env"});
console.log(__dirname+"/../.env")
const mysql = require('mysql2')

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_SECRET,
    database: process.env.DB_DB
})
const conTest = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_SECRET,
    database: process.env.DB_DB_TEST
})

module.exports = {
    con:con,
    test:conTest
}