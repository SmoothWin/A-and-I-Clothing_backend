const createTestTables = require('../../db/migration/createTablesTest')
const con = require('../../db/connection')
const app = require('../../index')
const supertest = require('supertest')
const server = app.listen()
const request = supertest.agent(server)

const url = "/login" 

//Constants for test
let loginData = {
    "email":"email5@a.com",
    "password":"Asd1234567890$",
}
beforeAll(()=>{
    createTestTables()
})
beforeEach(()=>{
    loginData = {
        "email":"email5@a.com",
        "password":"Asd1234567890$",
    }
})
afterEach(async ()=>{
    await request.post("/logout")
    server.close()
})

describe('/POST /login user authentication', ()=>{

    it('Login is successfull', async ()=>{
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(200)
        expect(res.headers["set-cookie"]).toBeDefined()
        
    })

    it('Login shouldn\'t work not matching password', async ()=>{
        loginData.password += "a" 
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(400)
        expect(res.headers["set-cookie"]).toBeUndefined()
        
    })

    it('Login unsuccessful email missing', async ()=>{
        loginData.email = ""
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(400)
        
    })
    it('Login unsuccessful email invalid', async ()=>{
        loginData.email = "e@e.c"
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(400)
        
    })  

    it('Login user password invalid contains only alhpabetical characters', async ()=>{
        loginData.password = "strongpassword"
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(400)
        
    })

    it('Login user password invalid doesn\'t have numbers', async ()=>{
        loginData.password = "strongpassword$"
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(400)
        
    })

    it('Login user password invalid doesn\'t have special characters', async ()=>{
        loginData.password = "strongpassword123"
        const res = await request.post(url)
        .send(loginData)
        
        expect(res.statusCode).toBe(400)
        
    })

})