const timeout = 15000;
const createTestTables = require('../../db/migration/createTablesTest')
const User = require('../../db/models/User')
const getUser = require('../../db/authentication').getUserInfo

let email = "email5@a.com"

beforeAll(()=>{
    createTestTables()
})

describe('Database read user', () => {
    it('Successfull database read', async () => {
      const result = await getUser(email)
      expect(result).toBeDefined();
      expect(result.result).toBe("Welcome");
      expect(result.user).toBeDefined();
      expect(result.user.userId).toBeDefined();
    }, timeout)

    it('Email doesn\'t exist', async () => {
        email = "2312312"
        try{
            await getUser(email)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("Something went wrong")
        }
    },timeout)
})