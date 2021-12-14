require('dotenv').config()
const express = require('express')

const app = express()
const port = process.env.SERVER_PORT

//Routes
const bigOrderRoute = require('./routes/bigorder')

app.use("/bigorders",bigOrderRoute)


app.listen(port, ()=>{
    console.log(`A&I Clothing app backend listening on localhost:${port}`)
})

module.exports = app