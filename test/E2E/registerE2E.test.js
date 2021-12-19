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
        await page.waitForSelector("#register_fName")
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

    test('register a user -> test input validation messages', async () => {


        await page.waitForSelector("#register_fName")
        await page.type("#register_fName", "c")
        await page.type("#register_lName", "c")
        await page.type("#register_email", "c")
        await page.type("#register_password", "c")
        await page.type('#register_cpassword', "c")
        await page.select('#register_country',"CA")
        await page.type("#register_phone", "1234")
        await page.type("#register_address", "21")
        await page.type("#register_apartNum","d1")
        await page.type("#register_city", "23")
        await page.type("#register_postal", "23")
        await page.type("#register_org", "s")
        
        let fName = await page.$eval("#firstNameSpan", e => e.textContent)
        console.log(fName)
        expect(fName).toBe("First name has to have more than 2 letters")
        let lName = await page.$eval("#lastNameSpan", e => e.textContent)
        expect(lName).toBe("Last name has to have more than 2 letters")
        let email = await page.$eval("#emailSpan", e => e.textContent)
        expect(email).toBe("Email has to have more than 4 letters")
        let password = await page.$eval("#passwordSpan", e => e.textContent)
        expect(password).toBe("Password needs to have at least 1 letter, 1 number, 1 special character and be at least 8 characters long")
        let cpassword = await page.$eval("#confirmPasswordSpan", e => e.textContent)
        expect(cpassword).toBe("Password has to match")
        let phone = await page.$eval("#phoneNumberSpan", e => e.textContent)
        expect(phone).toBe("Phone number has to have 10 numbers")
        let apartmentNum = await page.$eval("#civicSpan", e => e.textContent)
        expect(apartmentNum).toBe("Apartment should be only numbers")
        let address = await page.$eval("#addressSpan", e => e.textContent)
        expect(address).toBe("Address needs to contain building number, road type and road name")
        let city = await page.$eval("#citySpan", e => e.textContent)
        expect(city).toBe("City name must not contain any numbers")
        let postal = await page.$eval("#postalCodeSpan", e => e.textContent)
        expect(postal).toBe("Postal Code must have at least 5 characters")
        let org = await page.$eval("#organisationSpan", e => e.textContent)
        expect(org).toBe("Organisation name must have at least 3 characters")
        await page.click("#register_btn")



    }, timeout);

});
