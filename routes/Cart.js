const express = require('express')
const router = express.Router()

//middleware
const tokenChecker = require('../middleware/tokenChecker')

//db modules
const cart = require('../db/shoppingcart')

router.use(tokenChecker)

const Joi = require('joi')
const schema = Joi.object({
    id:Joi.string().token().required(),
    active:Joi.bool().required(),
    name:Joi.string().min(2).regex(/^([A-Za-z]| |-|\.|\&|\(|\))+$/).required(),
    description:Joi.string().regex(/[$\(\)<>]/, { invert: true }).required(),
    images:Joi.array().required(),
    metadata: Joi.object().required(),
    pd_id: Joi.string().token().required(),
    pd_active:Joi.bool().required(),
    pd_currency:Joi.string().min(3).max(3).required(),
    pd_price:Joi.number().required(),
    pd_price_string:Joi.string().regex(/^[0-9]+$/).required(),
    quantity: Joi.number().min(1).required(),
})

const schema2itemQuantityMetaData =  Joi.number().min(0).required()

const schema3itemQuantityCart = Joi.number().min(1).max(100).required()


router.post("/cart/add", async (req, res)=>{
    try{
        const decodedJWT = req.decoded
        const cartdata = req.body.cart

        // console.log(req.body)

        if(!cartdata)
            throw new Error("No cart data has been provided")

        //probably add a cart data validator for people who try to send/store invalid cart data JOI
        // console.log(JSON.parse(cartdata).items[0].pricedata)
        const filteredArray = []
        JSON.parse(cartdata).items.forEach(item => {
            let result = schema.validate({
                id:item.id,
                active:item.active,
                name:item.name,
                description:item.description,
                images:item.images,
                metadata: item.metadata,
                pd_id: item.pricedata.id,
                pd_active:item.pricedata.active,
                pd_currency:item.pricedata.currency,
                pd_price:item.pricedata.price,
                pd_price_string:item.pricedata.price_string,
                quantity:item.quantity,
            })
            let metadataCheck = {}
            let orderQuantitiesCheck = {}
            // console.log(item)
            Object.entries(item).every(x=>{

                if(x[0] == "metadata"){
                    Object.entries(x[1]).every(metaQty=>{
                        metadataCheck = schema2itemQuantityMetaData.validate(metaQty[1])
                        if(metadataCheck.error)
                            return false
                        return true
                    })
                }
                if(x[0].includes("_quantity")){
                    console.log(x[0]+" "+x[1])
                    orderQuantitiesCheck = schema3itemQuantityCart.validate(x[1])
                    console.log(orderQuantitiesCheck)
                    if(orderQuantitiesCheck.error)
                        return false
                    return true
                }

            })
            if(!result.error && !metadataCheck.error && !orderQuantitiesCheck.error)
                filteredArray.push(item)
            else{

                console.log("result.error")
                console.log(result.error)
                console.log("metadataCheck.error")

                console.log(metadataCheck.error)
                console.log("orderQuantitiesCheck.error")

                console.log(orderQuantitiesCheck.error)
            }

        });


        await cart.addToCart(decodedJWT.userId, JSON.stringify({items:filteredArray})) 

        //add/modify shopping cart in database using userId from decodedJWT

        return res.json({"message":"Cart insertion successful", cart_data:JSON.stringify({items:filteredArray})})
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