const timeout = 40000;

const emailT = "email5@a.com"
const passwordT = "Asd1234567890$"

beforeEach(async ()=>{
    await page.goto(URL+"/login", {waitUntil: 'domcontentloaded'});
}, timeout)

describe('Test Login page', () => { 

    test('page login render', async () => {
        let title = await page.title();
        expect(title).toBe("Login - A&I Clothing") 
    }, timeout);

    test('page fail login => not valid email, not valid password', async ()=>{
        await page.waitForSelector("input[type=email]",{visible:true})
        await page.type("input[type=email]","email.com")
        await page.type("input[type=password]","dasd123")
        let email = await page.$eval("#emailSpan", e=>e.textContent)
        expect(email).toBe("Enter email in the correct form")
        let password = await page.$eval("#passwordSpan", e=>e.textContent)
        expect(password).toBe("Password needs to have at least 1 letter, 1 number, 1 special character and be at least 8 characters long")

    },timeout)

    test('page fail login => no matching user', async ()=>{
        await page.waitForSelector("input[type=email]",{visible:true})
        await page.type("input[type=email]",emailT)
        await page.type("input[type=password]","dasd123$3")
        page.on('response', (res)=>{
            if(res.request().method() === "POST" && res.status() == 400){
                expect(res.status()).toEqual(400)
            }
        })
        await page.click("button[type=submit]")
        let responseMsg = await page.$eval("#submitSpan", e=>e.textContent)
        expect(responseMsg).toBe("Something went wrong with the login process")
        let url = page.url()
        expect(url).toContain(URL+'/login')
    },timeout)

    test('page fail login => no input', async ()=>{
        await page.waitForSelector("input[type=email]",{visible:true})
        page.on('response', (res)=>{
            if(res.request().method() === "POST" && res.status() == 400){
                expect(res.status()).toEqual(400)
            }
        })
        await page.click("button[type=submit]")
        let url = page.url()
        expect(url).toContain(URL+'/login')
    },timeout)

    test('page logging in', async ()=>{
        await page.waitForSelector("input[type=email]",{visible:true})
        await page.type("input[type=email]",emailT)
        await page.type("input[type=password]",passwordT)
        await page.click("button[type=submit]")
        
        await page.waitForNavigation({waitUntil:"domcontentloaded"})

        let url = page.url()

        expect(url).toContain(URL)
    },timeout)

});