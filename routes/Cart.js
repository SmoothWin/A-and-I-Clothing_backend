const express = require('express')
const router = express.Router()

//middleware
const tokenChecker = require('../middleware/tokenChecker')

//db modules
const cart = require('../db/shoppingcart')

router.use(tokenChecker)

router.post("/cart/add", async (req, res)=>{
    try{
        const decodedJWT = req.decoded
        const cartdata = req.body.cart

        // console.log(req.body)

        if(!cartdata)
            throw new Error("No cart data has been provided")

        //probably add a cart data validator for people who try to send/store invalid cart data JOI

        await cart.addToCart(decodedJWT.userId, cartdata) 

        //add/modify shopping cart in database using userId from decodedJWT

        return res.json({"message":"Cart insertion successful"})
    }catch(e){
        return res.status(400).json({"message":e.message})
    }
    
})

router.post("/cart/get", async (req, res)=>{
    try{
        const decodedJWT = req.decoded

        const response = await cart.getCartDataByUserId(decodedJWT.userId)
        //get returned object from added item database

        return res.json(response)
    }catch(e){
        /* istanbul ignore next */
        return res.status(400).json({"message":e.message})
    }
})

module.exports = router