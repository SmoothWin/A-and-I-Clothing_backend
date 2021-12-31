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
afterEach(()=>{
    server.close()
})

describe('/POST /login user authentication', ()=>{

    it('Login is successfull', async ()=>{
        const res = await request.post(url)
        .send(loginData)
        expect(res.statusCode).toBe(200)
        expect(res.headers["set-cookie"]).toBeDefined()
        
    })

    // it('Login with no valid jwt cookie', async ()=>{
    //     const res = await request.post(url)
    //     .set("Cookie", ['token=vd123sa;something=sdasda'])
    //     .withCredentials()
    //     .end(request.saveCookies("token"))
    //     console.log(res.headers)
    //     expect(res.statusCode).toBe(401)
    // })

    // it('Login with no jwt cookie', async ()=>{
    //     const res = await request.post(url).
    //     expect(res.statusCode).toBe(403)
    //     expect(res.headers["set-cookie"]).toBeUndefined()
    // })

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