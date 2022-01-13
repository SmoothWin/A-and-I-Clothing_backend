const timeout = 15000;
const createTestTables = require('../../db/migration/createTablesTest')
const getUser = require('../../db/authentication').getUserById

let id = "2c0633d05dfe11ecbfc90862662c2bec"

beforeAll(()=>{
    createTestTables()
})
beforeEach(()=>{
    id = "2c0633d05dfe11ecbfc90862662c2bec"
})

describe('Database read user by id', () => {
    it('Successful database read', async () => {
      const result = await getUser(id)
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      console.log(result.user)
      expect(result.user.firstName).toBeDefined();
      expect(result.user.lastName).toBeDefined();

    }, timeout)

    it('Unsuccessful database read', async () => {
        id = "fasdfasdfsa"
        try{
            await getUser(id)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("User is missing")
        }
    },timeout)
})