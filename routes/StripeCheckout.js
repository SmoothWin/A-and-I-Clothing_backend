const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

//custom middleware imports
const easyTokenChecker = require("../middleware/easyTokenChecker")

//custom db imports
const {getUserEmail} = require('../db/authentication')

router.post("/checkout", easyTokenChecker,async (req, res)=>{
    try{
        const decodedJWT = req.decoded
        console.log(decodedJWT.userId)

        let dbResult = null
        if(decodedJWT)
            dbResult = await getUserEmail(decodedJWT.userId)
            console.log(dbResult)
        const {items} = req.body
        console.log(items)

        const lineList = []
        items.forEach((item)=>{
            lineList.push({
                price: `price_${item.id}`,
                quantity:item.tot_quantity
            })
        })
        console.log(lineList)

        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.FRONTEND_URL}/success?id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            payment_method_types:['card'],
            mode:'payment',
            line_items:lineList
        })

        res.json({id:session.id})
    }catch(e){
        console.log(e)
        return res.status(400).json({"message":e.message})
    }
})

module.exports = router