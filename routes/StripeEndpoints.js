const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

router.get("/", async (req, res)=>{
    try{
        const productPrice = await stripe.prices.list((req.query.starting_after)?{starting_after:req.query.starting_after}:null)
        const products = await stripe.products.list((req.query.starting_after)?{starting_after:req.query.starting_after}:null)
        const changedList = []
        products.data.forEach((x,k)=>{
            if(x.object === "product")
                changedList.push({"id":x.id.replace("prod_",""), "active":x.active, "name":x.name,"description":x.description, "images":x.images, "metadata":x.metadata,
                "pricedata":{"id":productPrice.data[k].id.replace("price_",""),"active":productPrice.data[k].active, "price":productPrice.data[k].unit_amount}})
        })
        return res.json({"products": changedList, "has_more":productPrice.has_more})
    }catch(e){
        console.log(e)
        return res.status(404).json({"message":"Something went wrong with fetching the list of products"})
    }
})

router.get("/:productId", async (req, res)=>{
    try{
    const productPrice = await stripe.prices.retrieve(`price_${req.params.productId}`)

    const product = await stripe.products.retrieve(productPrice.product)
    if(!product.active)
        return res.status(404).json({"message":"Product is not available at the moment"})
    
    return res.json({"id":product.id.replace("prod_",""), "active":product.active, "name":product.name,"description":product.description, "images":product.images, "metadata":product.metadata,
        "pricedata":{"id":productPrice.id.replace("price_",""),"active":productPrice.active, "price":productPrice.unit_amount}})
    }catch(e){
        console.log(e)
        if(e.raw.code === "resource_missing")
            return res.status(404).json({"message":"Product is not found"})
        return res.status(404).json({"message":"Something went wrong with fetching the product"})
    }
})

router.post("/", async (req, res)=>{
    try{
        const ids = req.body.ids
        const products = await stripe.products.list({limit:100,ids:ids})
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

module.exports = router