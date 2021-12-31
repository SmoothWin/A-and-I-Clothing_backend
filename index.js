require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')

const app = express()

//Routes
const bigOrderRoute = require('./routes/bigorder')
const authRoute = require('./routes/Auth');
const stripeRoute = require('./routes/StripeEndpoints')


app.use(helmet())
app.use(express.json({limit:'4mb'}))
app.use(express.urlencoded({extended: true,limit:'4mb'}))
app.use(cors({origin:process.env.FRONTEND_URL, credentials:true}));
app.use(cookieParser())
//endpoints
app.use("/bigorders",bigOrderRoute)
app.use(authRoute)
app.use("/v1/products",stripeRoute)

module.exports = app