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

        await cart.addToCart(decodedJWT.userId, cartdata) 

        //add/modify shopping cart in database using userId from decodedJWT

        return res.json({"message":"Cart insertion successful"})
    }catch(e){
        return res.status(400).json({"message":"Something went wrong with syncing cart data"})
    }
    
})

router.post("/cart/get", async (req, res)=>{
    try{
        const decodedJWT = req.decoded

        const response = await cart.getCartDataByUserId(decodedJWT.userId)

        //add/modify shopping cart in database using userId from decodedJWT
        //get returned object from added item database

        return res.json(response)
    }catch(e){
        return res.status(400).json({"message":"Something went wrong with syncing cart data"})
    }
})