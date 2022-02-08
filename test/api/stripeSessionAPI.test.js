const app = require('../../index')
const supertest = require('supertest')
const server = app.listen()
const request = supertest.agent(server)

const url = "/checkout"
const invalidSessionId = "dfasfdas"
const validSessionId = "cs_test_b17G3MoAbxR8LxtKCuBOcOmXSZcemW6aefZSAVbwSy9BSTxBT8aDJ8AmO9" 
//this id must be from a transaction that
//took place on stripe if no valid sessions are provided at least 1 test will fail


let csrf = null
let cookie = null
const cartItems = [
    {
        "id":"price_1KBCnWFGY0rqHsBfxQcHPCXF",
        "product_id":"prod_KqucW9sBWFxYnD",
        "tot_quantity":2,
        "category_quantities":{
            "M_quantity":2
        }
    },
    {
        "id":"price_1KB1yPFGY0rqHsBfN9mGAMWR",
        "product_id":"prod_KqjRDEAuvmiD2Z",
        "tot_quantity":1,
        "category_quantities":{
            "L_quantity":1
        }
    },
    {
        "id":"price_1KCHFfFGY0rqHsBfEwwOYf4J",
        "product_id":"prod_Ks1IVbTT509aSb",
        "tot_quantity":1,
        "category_quantities":{
            "S_quantity":1
        }
    }
]

const cartItemsFaulty = [
    {
        "id":"fdasdfsad",
        "product_id":"prod_KqucW9sBWFxYnD",
        "tot_quantity":2,
        "category_quantities":{
            "M_quantity":2
        }
    },
    {
        "id":"price_1KB1yPFGY0rqHsBfN9mGAMWR",
        "product_id":"prod_KqjRDEAuvmiD2Z",
        "tot_quantity":1,
        "category_quantities":{
            "L_quantity":1,
            "M_quantity":23
        }
    },
    {
        "id":"price_1KCHFfFGY0rqHsBfEwwOYf4J",
        "product_id":"prod_Ks1IVbTT509aSb",
        "tot_quantity":0,
        "category_quantities":{
            "S_quantity":1
        }
    }
]
const cartItemsFaultySmall = [
    {
        "id":"price_1KBCnWFGY0rqHsBfxQcHPCXF",
        "product_id":"prod_KqucW9sBWFxYnD",
        "tot_quantity":1,
        "category_quantities":{
            "M_quantity":0
        }
    },
    {
        "id":"price_1KB1yPFGY0rqHsBfN9mGAMWR",
        "product_id":"prod_KqjRDEAuvmiD2Z",
        "tot_quantity":3,
        "category_quantities":{
            "L_quantity":1,
            "M_quantity":2
        }
    },
    {
        "id":"price_1KCHFfFGY0rqHsBfEwwOYf4J",
        "product_id":"prod_Ks1IVbTT509aSb",
        "tot_quantity":1,
        "category_quantities":{
            "S_quantity":1
        }
    }
]
const loginData = {
"email":"email5@a.com",
"password":"Asd1234567890$",
}

beforeEach(async ()=>{
    if(csrf == null){
        const csrfCall = await request.get("/validator/checker")
        csrf = csrfCall.body.token
      }
})
afterEach(async ()=>{
    await request.post("/logout")
    server.close()
})

describe('/GET /checkout/session', ()=>{

    it('sessionId not provided', async ()=>{
        const res = await request.get(`${url}/session`)
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe("sessionId not provided")
    })
    it('invalid sessionId', async ()=>{
        const res = await request.get(`${url}/session?id=${invalidSessionId}`)
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe("sessionId doesn't exist or has expired")
    })
    it('valid sessionId', async ()=>{
        const res = await request.get(`${url}/session?id=${validSessionId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.line_items).toBeDefined()
        expect(res.body.status).toBeDefined()
    })
    

})


describe('/POST /checkout', ()=>{
    
    it('checkout no account', async ()=>{
        const res = await request.post(`${url}`).set({'csrf-token':csrf}).send({items:cartItems})
        console.log(res.body)
        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBeDefined()
    })


    it('checkout with mix of hard faulty items', async ()=>{
        const res = await request.post(`${url}`).set({'csrf-token':csrf}).send({items:cartItemsFaulty})
        console.log(res.body)
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBeDefined()
    })
    it('checkout with mix of small faulty items', async ()=>{
        const res = await request.post(`${url}`).set({'csrf-token':csrf}).send({items:cartItemsFaultySmall})
        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBeDefined()
    })

    it('checkout with account', async ()=>{
        const resCookie = await request.post("/login").send(loginData).set({'csrf-token':csrf})
        
        
        cookie = resCookie.headers['set-cookie']
        const res = await request.post(`${url}`).set({'csrf-token':csrf}).set('Cookie',cookie.toString()).send({items:cartItems})
        
        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBeDefined()
    })

    // it('invalid sessionId', async ()=>{
    //     const res = await request.get(`${url}/session?id=${invalidSessionId}`)
    //     expect(res.statusCode).toBe(400)
    //     expect(res.body.message).toBe("sessionId doesn't exist or has expired")
    // })
    // it('valid sessionId', async ()=>{
    //     const res = await request.get(`${url}/session?id=${validSessionId}`)
    //     expect(res.statusCode).toBe(200)
    //     expect(res.body.line_items).toBeDefined()
    //     expect(res.body.status).toBeDefined()
    // })
    

})