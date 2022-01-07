const express = require('express')
const router = express.Router()

//middleware
const tokenChecker = require('../middleware/tokenChecker')

router.use(tokenChecker)

router.post("/cart/add", (req, res)=>{
    const decodedJWT = req.decoded
    const cartdata = req.body.cart

    //add/modify shopping cart in database using userId from decodedJWT
    //get returned object from added item database

    return res.json(cartdata)
    
})