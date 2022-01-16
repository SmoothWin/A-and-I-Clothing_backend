const app = require('../../index')
const supertest = require('supertest')
const server = app.listen(8001)
const request = supertest.agent(server)

const url = "/v1/products" 

describe('/GET /v1/products and /v1/products/:productId', ()=>{

    it('should get a list of products on sale (active and inactive)', async ()=>{
        const res = await request.get(url)
        expect(res.body.products).toBeDefined()
        expect(res.body.has_more).toBeDefined()
        expect(res.statusCode).toBe(200)
    })
    it('should fail getting a list of products', async ()=>{
        const res = await request.get(url+"?starting_after=randomdafjksadhbfjkashdfkj")
        expect(res.body.products).toBeUndefined()
        expect(res.body.has_more).toBeUndefined()
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("Something went wrong with fetching the list of products")
    })

    it('should get an existing specific product', async ()=>{
        const templateRes = await request.get(url)
        const res = await request.get(url+"/"+templateRes.body.products[0].pricedata.id)
        expect(res.body.id).toBeDefined()
        expect(res.body.active).toBeDefined()
        expect(res.body.name).toBeDefined()
        expect(res.body.description).toBeDefined()
        expect(res.body.images).toBeDefined()
        expect(res.body.metadata).toBeDefined()
        expect(res.statusCode).toBe(200)
    })

    it('should get an existing specific product', async ()=>{
        let templateRes = await request.get(url)
        let products = templateRes.body.products
        let has_more = templateRes.body.has_more
        while(true){
            templateRes = await request.get(url+"?starting_after="+products[products.length - 1].pricedata.id+"-"+products[products.length - 1].id)
            products = templateRes.body.products
            has_more = templateRes.body.has_more
            if(products.filter(x=>x.active === false).length > 0 || has_more === false) break
        }
        const filteredTemplate = products.filter(x=>x.active === false)
        if(filteredTemplate.length < 1) return
        const res = await request.get(url+"/"+filteredTemplate[0].id)
        console.log(res.body)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("Product is not available at the moment")
    })

    it('should fail getting a non-existing specific product', async ()=>{
        const res = await request.get(url+"/randomsdgasdkjhsadl")
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("Product is not found")
    })

})