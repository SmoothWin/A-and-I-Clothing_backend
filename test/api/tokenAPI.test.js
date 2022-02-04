const app = require('../../index')
const supertest = require('supertest')
const server = app.listen()
const request = supertest.agent(server)

const createTestTables = require('../../db/migration/createTablesTest')


//Constants for test
const loginData = {
    "email":"email5@a.com",
    "password":"Asd1234567890$",
}

let cookie = null
let csrf = null

const url = "/token"

beforeAll(()=>{
    createTestTables()
})
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

describe("/POST /token refresh api test and middleware test",()=>{
    it("Should be successful in refreshing the refresh token" ,async ()=>{
        const res = await request.post(url)
        .set({'csrf-token':csrf})
        .set('Cookie',cookie[1].toString()).send()
        expect(res.statusCode).toBe(200)
    })

    it("Should be unsuccessful in refreshing the refresh token" ,async ()=>{
        const res = await request.post(url)
        .set({'csrf-token':csrf})
        .send()
        console.log(res)
        expect(res.statusCode).toBe(403)
    })
})