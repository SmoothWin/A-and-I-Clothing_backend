const con = require('../../db/connection')
const User = require('../../db/models/User')

const timeout = 15000;

const newUser = new User(null, "Ch", "Ch", "email@a.com", "dummypassword123$",
"customer", "1","3423244321", "32 street boulevard", null, "Pr", "Da", "s1232", null,)

const emailT = "email@email.com"
const passwordT = "strongpassword123$"

beforeEach(async ()=>{
    await page.goto(URL+"/register", {waitUntil: 'domcontentloaded'});
})

describe('Test register page', () => { 

    test('page register render', async () => {
        let url = page.url()
        expect(url).toContain(URL+"/register") 
    }, timeout);

    test('register a user', async () => {
        await page.waitForSelector(".form-group")
        await page.type("#register_fName", newUser.firstName)
        await page.type("#register_lName", newUser.lastName)
        await page.type("#register_email", newUser.email)
        await page.type("#register_password", newUser.password)
        await page.type('#register_cpassword', newUser.password)
        await page.select('#register_country',"CA")
        await page.type("#register_phone", newUser.phoneNumber)
        await page.type("#register_address", newUser.address)
        // await page.type("#register_apartNum",newUser.buildingNumber)
        await page.type("#register_city", newUser.city)
        await page.type("#register_postal", newUser.postalCode)
        // await page.type("#register_org", newUser.organizationName)
        await page.click("#register_btn")
        await page.waitForNavigation({waitUntil:"domcontentloaded"})

        let url = page.url()

        expect(url).toContain(URL+'/login')

        con.query({
            sql:'DELETE FROM USERS WHERE email = ?',
            timeout:10000,
        }, [newUser.email])
    }, timeout);

});
