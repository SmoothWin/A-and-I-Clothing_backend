require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express()
const port = process.env.SERVER_PORT

//Routes
const bigOrderRoute = require('./routes/bigorder')
const authRoute = require('./routes/Auth');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin:"https://www.thunderclient.io"}));
app.use(cookieParser())
//endpoints
app.use("/bigorders",bigOrderRoute)
app.use(authRoute)



app.listen(port, ()=>{
    console.log(`A&I Clothing app backend listening on localhost:${port}`)
})

module.exports = app