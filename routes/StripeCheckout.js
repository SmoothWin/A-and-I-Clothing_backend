const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const Joi = require('joi')

//custom middleware imports
const easyTokenChecker = require("../middleware/easyTokenChecker")

//custom db imports
const {getUserEmail} = require('../db/authentication')

const orderCheck = Joi.number().min(1).max(99).required()

router.get("/checkout/session", async (req, res)=>{
    try{
        const session = await stripe.checkout.sessions.retrieve(req.query?.id,
            {
                expand: ['line_items']
            })

        const line_items = session.line_items
        const metadata = session.metadata
        const status = session.payment_status

        const ids = Object.keys(metadata)
        const products = await stripe.products.list({limit:100,ids:ids})
        console.log(products)

        const lineItems = line_items.data.map(x=>{
            return {
                product_id:x.price.product,
                price_id:x.price.id,
                product_name:x.description,
                unit_price:x.price.unit_amount,
                subtotal:x.amount_subtotal,
                total:x.amount_subtotal,
                total_quantity:x.quantity,
            }
        })
        lineItems.forEach(x=>{
            products.data.forEach(prod=>{
                if(prod.id == x.product_id)
                    x["images"]=prod.images
            })
        })

        const secondaryQuantities = Object.entries(metadata).map(x=>{
            return {
                [x[0]]:JSON.parse(x[1])
            }
        })
        lineItems.forEach(item => {
            Object.values(secondaryQuantities).forEach(x=>{
                Object.entries(x).forEach(value=>{
                    if(item.product_id == value[0]){

                        console.log()
                        item["secondary_quantities"] = value[1]
                    }
                })
               
            })
        });
        

        return res.json({line_items:lineItems, status:status})
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
        // console.log(items)

        const lineList = []
        const metadata = {}
        let metadataCheck = {}
        items.forEach((item)=>{

            let itemQuantities = JSON.stringify(item.category_quantities)
            // console.log(itemQuantities)
            let isItGood = Object.entries(item.category_quantities).every(x=>{
                if(!x[0].includes("_quantity")){
                    return false
                }
                metadataCheck = orderCheck.validate(x[1])
                if(metadataCheck.error)
                    return false
                return true  
            })
            console.log(isItGood)
            if (isItGood){
                metadata[item.product_id] = itemQuantities
                lineList.push({
                    price: `${item.id}`,
                    quantity:item.tot_quantity
                })
            }
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