const app = require('../../index')
const createTestTables = require('../../db/migration/createTablesTest')
const con = require('../../db/connection')
const supertest = require('supertest')
const request = supertest(app)

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
        "buildingNumber":"",
        "city":"Pr",
        "country":"Da",
        "postalCode":"s1232",
        "organizationName":""
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



describe('/POST /register user registration', ()=>{

    it('Register user password invalid contains only alhpabetical characters', async ()=>{
        registerData.password = "strongpassword"
        registerData.confirmpassword = "strongpassword"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register user password invalid doesn\'t have numbers', async ()=>{
        registerData.password = "strongpassword$"
        registerData.confirmpassword = "strongpassword$"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register user password invalid doesn\'t have special characters', async ()=>{
        registerData.password = "strongpassword123"
        registerData.confirmpassword = "strongpassword123"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register user password invalid doesn\'t have matching confirmation password', async ()=>{
        registerData.password = "strongpassword123$"
        registerData.confirmpassword = "Strongpassword123$"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register user password invalid contains only alhpabetical characters', async ()=>{
        registerData.password = "strongpassword"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register user should be successfull', async ()=>{
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(200)
    })
    it('Register unsuccessful Firstname too short', async ()=>{
        registerData.firstName = "C"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    
    it('Register unsuccessful Firstname not purely alhpabetical', async ()=>{
        registerData.firstName = "C$#$%fsdf23123"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful Firstname missing', async ()=>{
        registerData.firstName = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful Lastname too short', async ()=>{
        registerData.lastName = "C"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful Lastname not purely alhpabetical', async ()=>{
        registerData.lastName = "C$#$%fsdf23123"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful Lastname missing', async ()=>{
        registerData.lastName = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful email missing', async ()=>{
        registerData.email = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful email invalid', async ()=>{
        registerData.email = "e@e.c"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful phoneCountryCode too long', async ()=>{
        registerData.phoneCountryCode = "1234"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful phoneCountryCode contains character other than numbers', async ()=>{
        registerData.phoneCountryCode = "1b$"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful phoneCountryCode missing', async ()=>{
        registerData.phoneCountryCode = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful phoneNumber too long', async ()=>{
        registerData.phoneNumber = "32132132141"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful phoneNumber contains character other than numbers', async ()=>{
        registerData.phoneNumber = "452ds#$231"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful phoneNumber missing', async ()=>{
        registerData.phoneNumber = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful address not contain numbers', async ()=>{
        registerData.address = "boulevard avenue"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful address not more than 2 alphabetical words', async ()=>{
        registerData.address = "98 avenue"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful address missing', async ()=>{
        registerData.address = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful buildingNumber not only numbers', async ()=>{
        registerData.buildingNumber = "23fa$#21"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful city contains non alphabetical characters', async ()=>{
        registerData.city = "asDa#$323f"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful city is missing', async ()=>{
        registerData.city = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful country too short', async ()=>{
        registerData.country = "C"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })
    it('Register unsuccessful country not only alphabetical', async ()=>{
        registerData.country = "C#$@s2312"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful postalCode not long enough', async ()=>{
        registerData.postalCode = "23ds"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful postalCode missing', async ()=>{
        registerData.postalCode = ""
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })

    it('Register unsuccessful organizationName not long enough', async ()=>{
        registerData.organizationName = "A"
        const res = await request.post('/register')
        .send(registerData)
        expect(res.statusCode).toBe(400)
    })


})