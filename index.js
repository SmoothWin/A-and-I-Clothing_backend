require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet')

const app = express()

const csrfMiddleware = csurf({
    cookie: true,
  });


//Routes
const csrfchecker = require('./routes/csrfchecker')
const bigOrderRoute = require('./routes/bigorder')
const authRoute = require('./routes/Auth');
const stripeRoute = require('./routes/StripeEndpoints')
const cart = require('./routes/Cart')

app.use(helmet())
app.use(express.json({limit:'4mb'}))
app.use(express.urlencoded({extended: true,limit:'4mb'}))
app.use(cors({origin:process.env.FRONTEND_URL, credentials:true}));
app.use(cookieParser())
app.use(csrfMiddleware);
//endpoints
app.use(csrfchecker)
app.use(authRoute)
app.use("/bigorders",bigOrderRoute)
app.use("/v1/products",stripeRoute)
app.use(cart)

module.exports = app