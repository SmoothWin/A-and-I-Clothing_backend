
const timeout = 15000;
const app = require('../../index')
const createTestTables = require('../../db/migration/createTablesTest')
const supertest = require('supertest')
const server = app.listen()
const request = supertest.agent(server)

const con = require('../../db/connection')

const urlAdd = "/cart/add" 
const urlGet = "/cart/get" 

//Constants for test
const loginData = {
    "email":"email5@a.com",
    "password":"Asd1234567890$",
}
const cartSuccessful= `{"items":[{"id":"Ks1IVbTT509aSb","active":true,"name":"glasses","description":"some dark glasses...","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfMWFOUko5aGY5WlVqQ1kxUkZxajlmeERI00tPgRtexx"],"metadata":{},"pricedata":{"id":"1KCHFfFGY0rqHsBfEwwOYf4J","active":true,"currency":"cad","price":200,"price_string":"200"},"quantity":3},{"id":"KqjRDEAuvmiD2Z","active":true,"name":"T-Shirt","description":"A nice T-Shirt","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfV0JXaExWWUdQdGhHRUVDYllDRlM2ejNW00YqEiyAj2"],"metadata":{"Color":"Red"},"pricedata":{"id":"1KB1yPFGY0rqHsBfN9mGAMWR","active":true,"currency":"cad","price":2999,"price_string":"2999"},"quantity":2},{"id":"Ks1H7T0qSTTghC","active":true,"name":"good time","description":"very dark time :(","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfUDdSWVN2THNKdWhQTkZST2E0Q3lKQkY000iE1XsyFz"],"metadata":{},"pricedata":{"id":"1KCHFAFGY0rqHsBfix8LIXEi","active":true,"currency":"cad","price":100,"price_string":"100"},"quantity":4}]}`

let cookie = null
let csrf = null

beforeAll(()=>{
    createTestTables()
},timeout)
beforeEach(async ()=>{
    try{
        if(csrf == null){
          const csrfCall = await request.get("/validator/checker")
          csrf = csrfCall.body.token
        }
        const res = await request.post("/login").send(loginData).set({'csrf-token':csrf})
        
        
        cookie = res.headers['set-cookie']
        console.log(cookie)
      }catch(e){
        console.log(e)
      }
})
afterEach(async ()=>{
    await request.post("/logout")
    server.close()
})

describe('/POST /cart/get', ()=>{
    it('should get a acquire a list of items stored in the database', async ()=>{
        const res = await request.post(urlGet)
        .set({'csrf-token':csrf}).set('Cookie',cookie.toString())
        .send()

        expect(res.statusCode).toBe(200)
    },timeout)
})

describe('/POST /cart/add', ()=>{
    it('should insert cart data and either add or update cart in the database', async ()=>{
        const res = await request.post(urlAdd)
        .set({'csrf-token':csrf}).set('Cookie',cookie.toString())
        .send({cart:cartSuccessful})

        con.query({
            sql:"DELETE FROM SHOPPING_CART",
            timeout:10000,
        }, (err)=>{
            if(err) return
            return
        })


        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe("Cart insertion successful")
    },timeout)

    it('should fail cart data in the database', async ()=>{
        const res = await request.post(urlAdd)
        .set({'csrf-token':csrf}).set('Cookie',cookie.toString())
        .send()


        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe("No cart data has been provided")
    },timeout)
})
