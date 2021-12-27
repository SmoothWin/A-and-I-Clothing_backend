const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

router.get("/v1/products", async (req, res)=>{
    try{
        const products = await stripe.products.list()
        const changedList = []
        products.data.forEach(x=>{
            if(x.object === "product")
                changedList.push({"id":x.id, "active":x.active, "name":x.name,"description":x.description, "images":x.images, "metadata":x.metadata})
        })
        return res.json({"products": changedList, "has_more":products.has_more})
    }catch(e){
        return res.status(404).json({"message":"Something went wrong with fetching the list of products"})
    }
})

router.get("/v1/products/:productId", async (req, res)=>{
    try{
    const product = await stripe.products.retrieve(req.params.productId)
    if(!product.active)
        return res.status(404).json({"message":"Product is not available at the moment"})
    
    return res.json({"id":product.id, "active":product.active, "name":product.name,"description":product.description, "images":product.images, "metadata":product.metadata})
    }catch(e){
        if(e.raw.code === "resource_missing")
            return res.status(404).json({"message":"Product is not found"})
        return res.status(404).json({"message":"Something went wrong with fetching the product"})
    }
})

module.exports = router