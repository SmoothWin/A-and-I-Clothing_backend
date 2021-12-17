const createTestTables = require('../../db/migration/createTablesTest')
const con = require('../../db/connection')
const app = require('../../index')
const supertest = require('supertest')
const request = supertest(app)

const kill = require('kill-port')

const url = "/register"

//Constants for test
let registerData = {
    "firstName":"CH",
    "lastName":"CH",
    "email":"email@a.com",
    "password":"Asd1234567890$",
    "confirmpassword":"Asd1234567890$",
    "phoneCountryCode":"1",
    "phoneNumber":"342-324-4321",
    "address":"32 street boulevard",
    "buildingNumber":"",
    "city":"Pr",
    "country":"Da",
    "postalCode":"s1232",
    "organizationName":""
}
beforeAll(()=>{
    createTestTables()
})
beforeEach(()=>{
    registerData = {
        "firstName":"CH",
        "lastName":"CH",
        "email":"email@a.com",
        "password":"Asd1234567890$",
        "confirmpassword":"Asd1234567890$",
        "phoneCountryCode":"1",
        "phoneNumber":"342-324-4321",
        "address":"32 street boulevard",
        "buildingNumber":null,
        "city":"Pr",
        "country":"Da",
        "postalCode":"s1232",
        "organizationName":null
    }
})
afterEach(()=>{
    try{
    con.query({
        sql:"DELETE FROM users where email = ?"
    },[registerData.email])
    }catch(e){

    }
})

afterAll(async ()=>{
    try{
        await kill(process.env.SERVER_PORT)
    }catch(e){

    }
})

describe('/POST /register user registration', ()=>{

    it('Register user password invalid contains only alhpabetical characters', async (done)=>{
        registerData.password = "strongpassword"
        registerData.confirmpassword = "strongpassword"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register user password invalid doesn\'t have numbers', async (done)=>{
        registerData.password = "strongpassword$"
        registerData.confirmpassword = "strongpassword$"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register user password invalid doesn\'t have special characters', async (done)=>{
        registerData.password = "strongpassword123"
        registerData.confirmpassword = "strongpassword123"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register user password invalid doesn\'t have matching confirmation password', async (done)=>{
        registerData.password = "strongpassword123$"
        registerData.confirmpassword = "Strongpassword123$"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register user should be successfull', async (done)=>{
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(200)
        done()
    })
    it('Register unsuccessful Firstname too short', async (done)=>{
        registerData.firstName = "C"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    
    it('Register unsuccessful Firstname not purely alhpabetical', async (done)=>{
        registerData.firstName = "C$#$%fsdf23123"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful Firstname missing', async (done)=>{
        registerData.firstName = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful Lastname too short', async (done)=>{
        registerData.lastName = "C"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful Lastname not purely alhpabetical', async (done)=>{
        registerData.lastName = "C$#$%fsdf23123"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful Lastname missing', async (done)=>{
        registerData.lastName = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful email missing', async (done)=>{
        registerData.email = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful email invalid', async (done)=>{
        registerData.email = "e@e.c"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful phoneCountryCode too long', async (done)=>{
        registerData.phoneCountryCode = "1234"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful phoneCountryCode contains character other than numbers', async (done)=>{
        registerData.phoneCountryCode = "1b$"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful phoneCountryCode missing', async (done)=>{
        registerData.phoneCountryCode = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful phoneNumber too long', async (done)=>{
        registerData.phoneNumber = "32132132141"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful phoneNumber contains character other than numbers', async (done)=>{
        registerData.phoneNumber = "452ds#$231"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful phoneNumber missing', async (done)=>{
        registerData.phoneNumber = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful address not contain numbers', async (done)=>{
        registerData.address = "boulevard avenue"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful address not more than 2 alphabetical words', async (done)=>{
        registerData.address = "98 avenue"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful address missing', async (done)=>{
        registerData.address = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful buildingNumber not only numbers', async (done)=>{
        registerData.buildingNumber = "23fa$#21"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful city contains non alphabetical characters', async (done)=>{
        registerData.city = "asDa#$323f"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful city is missing', async (done)=>{
        registerData.city = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful country too short', async (done)=>{
        registerData.country = "C"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })
    it('Register unsuccessful country not only alphabetical', async (done)=>{
        registerData.country = "C#$@s2312"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful postalCode not long enough', async (done)=>{
        registerData.postalCode = "23ds"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful postalCode missing', async (done)=>{
        registerData.postalCode = ""
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })

    it('Register unsuccessful organizationName not long enough', async (done)=>{
        registerData.organizationName = "A"
        const res = await request.post(url)
        .send(registerData)
        expect(res.statusCode).toBe(400)
        done()
    })


})