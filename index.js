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
const csrfchecker = require(__dirname+'/routes/csrfchecker')
const bigOrderRoute = require(__dirname+'/routes/bigorder')
const authRoute = require(__dirname+'/routes/auth');
const stripeRoute = require(__dirname+'/routes/stripeGetProductEndpoints')
const stripeCheckoutRoute = require(__dirname+"/routes/stripeCheckout")
const stripeWebhook = require(__dirname+"/routes/stripeWebhook")
const cart = require(__dirname+'/routes/cart')

app.use(helmet())
app.use('/webhook', express.raw({type: "*/*"}))
app.use(express.json({limit:'4mb'}))
app.use(express.urlencoded({extended: true,limit:'4mb'}))
app.use(cors({origin:process.env.FRONTEND_URL, credentials:true}));
app.use(cookieParser())
app.use(stripeWebhook)
app.use(csrfMiddleware);
//endpoints
app.use(csrfchecker)
app.use(authRoute)
app.use("/bigorders",bigOrderRoute)
app.use("/v1/products",stripeRoute)
app.use(stripeCheckoutRoute)
app.use(cart)

module.exports = app