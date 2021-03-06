const rateLimit = require('express-rate-limit')
const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const Joi = require('joi')

//custom middleware imports
const easyTokenChecker = require(__dirname+"/../middleware/easyTokenChecker")

//custom db imports
const {getUserEmail} = require(__dirname+'/../db/authentication')

const orderCheck = Joi.number().min(1).max(99).required()

const checkoutLimit = rateLimit({
	windowMs: 60 * 1000, // 60 seconds
	max: 1, // Limit each IP to 1 requests per `window` (here, per 1 minute)
    message:
		'Too many checkout requests, complete your already existing one or wait for a few minutes',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true,
    skipSuccessfulRequests:(process.env.TEST_ENVIRONMENT == "testing")?true:false,
})

router.get("/checkout/session", async (req, res)=>{
    try{
        if(typeof req.query?.id === "undefined")
            return res.status(400).json({message:"sessionId not provided"})
        const session = await stripe.checkout.sessions.retrieve(req.query?.id,
            {
                expand: ['line_items']
            })

        const line_items = session.line_items
        const metadata = session.metadata
        const status = session.payment_status

        const ids = Object.keys(metadata)
        const products = await stripe.products.list({limit:100,ids:ids})
        // console.log(products)

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
                        item["secondary_quantities"] = value[1]
                    }
                })
               
            })
        });
        

        return res.json({line_items:lineItems, status:status})
    }catch(e){
        // console.log(e)
        return res.status(400).json({message:"sessionId doesn't exist or has expired"})
    }
})

router.post("/checkout", [checkoutLimit,easyTokenChecker],async (req, res)=>{
    try{
        const decodedJWT = req.decoded
        // console.log(decodedJWT?.userId)

        let dbResult = null
        if(decodedJWT)
            dbResult = await getUserEmail(decodedJWT.userId)
            // console.log(dbResult)
        const {items} = req.body

        const lineList = []
        const metadata = {}
        let metadataCheck = {}
        const listOfCartItems = items.map(x=>{return {id:x.id, product_id:x.product_id}})
        const marketItems = await stripe.products
                            .list({limit:100,ids:listOfCartItems.map(x=>x.product_id)})
                            // console.log(marketItems.data)
        items.forEach((item)=>{
            
                let itemQuantities = JSON.stringify(item.category_quantities)
                console.log(itemQuantities)
                let isItGood = Object.entries(item.category_quantities).every(x=>{
                    if(!x[0].includes("_quantity")){
                        return false
                    }
                    metadataCheck = orderCheck.validate(x[1])
                    if(metadataCheck.error)
                        return false
                    return true  
                })
                // console.log(isItGood)
                if (isItGood){
                    if(Object.values(JSON.parse(itemQuantities)).length > 0){
                        let itemValid = {}
                        // console.log(item)
                        marketItems.data.forEach(checkItem =>{
                            if(item.product_id == checkItem.id){
                                Object.entries(checkItem.metadata).forEach(type=>{
                                    if(typeof item.category_quantities[type[0]] != 'undefined'){
                                        itemValid[type[0]] = (item.category_quantities[type[0]] <= checkItem.metadata[type[0]] 
                                                        && item.category_quantities[type[0]] > 0)
                                                        console.log((item.category_quantities[type[0]] <= checkItem.metadata[type[0]] 
                                                            && item.category_quantities[type[0]] > 0))
                                    }
                                }) 
                            }

                        })
                        let itemObject = JSON.parse(itemQuantities)
                        let quantitiesRemoved = 0 //value to track removed total item count for the incomming check
                        Object.entries(itemValid).forEach(x=>{
                            if(x[1] == false){
                                quantitiesRemoved += itemObject[x[0]]
                                // console.log(itemObject[x[0]])
                                delete itemObject[x[0]]
                            }
                        })
                        if(Object.entries(itemObject).length > 0) {
                            itemQuantities = JSON.stringify(itemObject)
                            metadata[item.product_id] = itemQuantities
                            lineList.push({
                                price: `${item.id}`,
                                quantity:item.tot_quantity - quantitiesRemoved
                            })
                        }
                    }
                }
            
        })
        console.log(metadata)
        console.log(lineList)
        let quantityModified = {}
        marketItems.data.forEach(x=>{
            Object.entries(metadata).forEach(m=>{
                if(m[0] == x.id){
                    Object.entries(JSON.parse(m[1])).forEach(cQty=>{
                        // console.log("Key: "+cQty[0])
                        // console.log("Substract Qty: "+cQty[1])
                        // console.log("Original Qty: "+ x.metadata[cQty[0]])
                        // console.log(x.metadata[cQty[0]]-cQty[1])
                        quantityModified[m[0]] = {[cQty[0]]: parseInt(x.metadata[cQty[0]])-parseInt(cQty[1])}
                    })
                }
            })
            // console.log(x.metadata)
        })
        // console.log(marketItems.data)
        console.log(quantityModified)


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
            cancel_url: `${process.env.FRONTEND_URL}/cancel?id={CHECKOUT_SESSION_ID}`,
            payment_method_types:['card'],
            mode:'payment',
            line_items:lineList,
            metadata:metadata
        })

        //remove item quantity
        Object.entries(quantityModified).forEach(async x=>{
            await stripe.products.update(
                x[0],
                {metadata:x[1]}
            )
        })

        setTimeout(async ()=>{
            try{
                await stripe.checkout.sessions.expire(
                    session.id
                )
                //add item quantity back in this section
            }
            catch(e){

            }
        // }, 900000)//15 minutes
        }, (process.env.TEST_ENVIRONMENT == "testing")?90000:process.env.EXPIRE_COOLDOWN)

        res.json({id:session.id})
    }catch(e){
        // console.log(e)
        return res.status(400).json({"message":"No stocked items were present for the checkout"})
    }
})

module.exports = router