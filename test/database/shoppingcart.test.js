const timeout = 15000;
const con = require('../../db/connection')

const createTestTables = require('../../db/migration/createTablesTest')
const {addToCart, getCartDataByUserId} = require('../../db/shoppingcart')

let id = "2c0633d05dfe11ecbfc90862662c2bec"

const cartSuccessful= `{"items":[{"id":"Ks1IVbTT509aSb","active":true,"name":"glasses","description":"some dark glasses...","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfMWFOUko5aGY5WlVqQ1kxUkZxajlmeERI00tPgRtexx"],"metadata":{},"pricedata":{"id":"1KCHFfFGY0rqHsBfEwwOYf4J","active":true,"currency":"cad","price":200,"price_string":"200"},"quantity":3},{"id":"KqjRDEAuvmiD2Z","active":true,"name":"T-Shirt","description":"A nice T-Shirt","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfV0JXaExWWUdQdGhHRUVDYllDRlM2ejNW00YqEiyAj2"],"metadata":{"Color":"Red"},"pricedata":{"id":"1KB1yPFGY0rqHsBfN9mGAMWR","active":true,"currency":"cad","price":2999,"price_string":"2999"},"quantity":2},{"id":"Ks1H7T0qSTTghC","active":true,"name":"good time","description":"very dark time :(","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfUDdSWVN2THNKdWhQTkZST2E0Q3lKQkY000iE1XsyFz"],"metadata":{},"pricedata":{"id":"1KCHFAFGY0rqHsBfix8LIXEi","active":true,"currency":"cad","price":100,"price_string":"100"},"quantity":4}]}`

beforeAll(()=>{
    createTestTables()
},timeout)
beforeEach(()=>{
    id = "2c0633d05dfe11ecbfc90862662c2bec"
})

describe('Database getCartDataByUserId', () => {
    

    it('Unsuccessful database read', async () => {
        id = "fasdfasdfsa"
        try{
            await getCartDataByUserId(id)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("Cart is missing")
        }
    },timeout)

    it('Successfull database read', async () => {
        const result = await getCartDataByUserId(id)
        console.log(result)
        expect(result).toBeDefined();
        expect(result.shopping_cart).toBeDefined()
        expect(result.shopping_cart.cart_id).toBeDefined()
        expect(result.shopping_cart.user_id).toBeDefined()
        expect(result.shopping_cart.cart_data).toBeDefined()
  
      }, timeout)
})

describe('Database addToCart', () => {
    

    it('Unsuccessful database save', async () => {
        id = "fasdfasdfsa"
        try{
            await addToCart(id,null)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("Something went wrong with adding cart data")
        }
    },timeout)
    
    it('Successfull database save', async () => {
        const result = await addToCart(id,cartSuccessful)
        console.log(result)
        expect(result).toBeDefined();
        expect(result.result).toBe("Data has been added")
  
      }, timeout)
})