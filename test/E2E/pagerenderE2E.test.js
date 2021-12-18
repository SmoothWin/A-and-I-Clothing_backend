
const timeout = 15000;

describe('Test page rendering', () => { 

    afterAll(async ()=>{
    })

    test('page index render', async () => {
        await page.goto(URL, {waitUntil: 'domcontentloaded'});
        let title = await page.title("A&I Clothing"); 
        expect(title).toBe('A&I Clothing'); 
        }, timeout);

    test('page big order render', async () => {
        await page.goto(URL+"/bigorder", {waitUntil: 'domcontentloaded'});
        let title = await page.title();
        return expect(title).toBe("Big Order - A&I Clothing") 
        }, timeout);

});