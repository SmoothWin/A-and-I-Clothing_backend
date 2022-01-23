const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

//custom middleware imports
const easyTokenChecker = require("../middleware/easyTokenChecker")

//custom db imports
const {getUserEmail} = require('../db/authentication')


router.get("/checkout/session", async (req, res)=>{
    try{
        const session = await stripe.checkout.sessions.retrieve(req.query?.id,
            {
                expand: ['line_items']
            })
        return res.json(session)
    }catch(e){
        console.log(e)
        return res.status(400).json({message:"sessionId doesn't exist or has expired"})
    }
})

router.post("/checkout", easyTokenChecker,async (req, res)=>{
    try{
        const decodedJWT = req.decoded
        // console.log(decodedJWT?.userId)

        let dbResult = null
        if(decodedJWT)
            dbResult = await getUserEmail(decodedJWT.userId)
            // console.log(dbResult)
        const {items} = req.body
        console.log(items)

        const lineList = []
        const metadata = {}
        items.forEach((item)=>{
            metadata[item.product_id] = JSON.stringify(item.category_quantities)
            lineList.push({
                price: `price_${item.id}`,
                quantity:item.tot_quantity
            })
        })
        console.log(metadata)

        const session = await stripe.checkout.sessions.create((dbResult?.email)?
        {
            success_url: `${process.env.FRONTEND_URL}/success?id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            payment_method_types:['card'],
            mode:'payment',
            line_items:lineList,
            customer_email:dbResult.email,
            metadata:metadata

        }:{
            success_url: `${process.env.FRONTEND_URL}/success?id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            payment_method_types:['card'],
            mode:'payment',
            line_items:lineList,
            metadata:metadata
        })

        res.json({id:session.id})
    }catch(e){
        console.log(e)
        return res.status(400).json({"message":"Something went wrong with checking out"})
    }
})

module.exports = router