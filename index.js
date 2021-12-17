require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express()

//Routes
const bigOrderRoute = require('./routes/bigorder')
const authRoute = require('./routes/Auth');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin:process.env.FRONTEND_URL, credentials:true}));
app.use(cookieParser())
//endpoints
app.use("/bigorders",bigOrderRoute)
app.use(authRoute)

module.exports = app