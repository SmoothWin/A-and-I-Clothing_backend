require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet')

const app = express()

const csrfMiddleware = csurf({
    cookie: {
      sameSite:'none',
      // domain:(process.env.FRONTEND_URL.includes("http://")?process.env.FRONTEND_URL.replace("http://",""):process.env.FRONTEND_URL.replace("https://",""))
      secure:true
    }
  });


//Routes
const csrfchecker = require(__dirname+'/routes/csrfchecker')
const bigOrderRoute = require(__dirname+'/routes/Bigorder')
const authRoute = require(__dirname+'/routes/Auth');
const stripeRoute = require(__dirname+'/routes/StripeGetProductEndpoints')
const stripeCheckoutRoute = require(__dirname+"/routes/StripeCheckout")
const stripeWebhook = require(__dirname+"/routes/StripeWebhook")
const cart = require(__dirname+'/routes/Cart')

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