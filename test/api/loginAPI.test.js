const createTestTables = require('../../db/migration/createTablesTest')
const con = require('../../db/connection')
const app = require('../../index')
const supertest = require('supertest')
const server = app.listen(8001)
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
afterEach(()=>{
    server.close()
})

describe('/POST /login user registration', ()=>{

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