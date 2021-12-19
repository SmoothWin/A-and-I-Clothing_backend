const timeout = 15000;

const emailT = "email5@a.com"
const passwordT = "Asd1234567890$"

beforeEach(async ()=>{
    await page.goto(URL+"/login", {waitUntil: 'domcontentloaded'});
})

describe('Test Login page', () => { 

    test('page login render', async () => {
        let title = await page.title();
        expect(title).toBe("Login - A&I Clothing") 
    }, timeout);

    test('page fail login => not valid email', async ()=>{
        await page.waitForSelector("input[type=email]")
        await page.type("input[type=email]","email.com")
        await page.type("input[type=password]","dasd123")
    },timeout)

    test('page fail login => no matching user', async ()=>{
        await page.waitForSelector("input[type=email]")
        await page.type("input[type=email]",emailT)
        await page.type("input[type=password]","dasd123$")
        page.on('response', (res)=>{
            if(res.request().method() === "POST" && res.status() == 400){
                expect(res.status()).toEqual(400)
            }
        })
        await page.click("button[type=submit]")
        let url = page.url()
        expect(url).toContain(URL+'/login')
    },timeout)

    test('page fail login => no input', async ()=>{
        await page.waitForSelector("input[type=email]")
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
        await page.waitForSelector("input[type=email]")
        await page.type("input[type=email]",emailT)
        await page.type("input[type=password]",passwordT)
        await page.click("button[type=submit]")
        
        await page.waitForNavigation({waitUntil:"domcontentloaded"})

        let url = page.url()

        expect(url).toContain(URL)
    },timeout)

});