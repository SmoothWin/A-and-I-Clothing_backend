const createTestTables = require('../../db/migration/createTablesTest')
const con = require('../../db/connection')
const app = require('../../index')
const supertest = require('supertest')
const request = supertest(app)

const kill = require('kill-port')

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

afterAll(async ()=>{
    try{
        await kill(process.env.SERVER_PORT)
    }catch(e){

    }
})

describe('/POST /login user registration', ()=>{

    it('Login user password invalid contains only alhpabetical characters', async (done)=>{
        registerData.password = "strongpassword"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Login user password invalid doesn\'t have numbers', async ()=>{
        registerData.password = "strongpassword$"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Login user password invalid doesn\'t have special characters', async ()=>{
        registerData.password = "strongpassword123"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

})