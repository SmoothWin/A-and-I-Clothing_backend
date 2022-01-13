const timeout = 15000;
const con = require('../../db/connection')

const createTestTables = require('../../db/migration/createTablesTest')
const {addRefreshToken, getRefreshToken} = require('../../db/tokenStorage')

let id = "2c0633d05dfe11ecbfc90862662c2bec"

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYzA2MzNkMDVkZmUxMWVjYmZjOTA4NjI2NjJjMmJlYyIsImZpcnN0TmFtZSI6IkNoIiwibGFzdE5hbWUiOiJDaCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY0MjA5MTYzNywiZXhwIjoxNjQ0NzIxNDM3fQ.T9SSY4WSdkYGNIJ6T6r0OiNKbgJBT0zJqUjx-qy6b2I"

beforeAll(()=>{
    createTestTables()
},timeout)
beforeEach(()=>{
    id = "2c0633d05dfe11ecbfc90862662c2bec"
})

describe('Database getRefreshToken', () => {
    

    it('Unsuccessful database read', async () => {
        id = "fasdfasdfsa"
        try{
            await getRefreshToken(id)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("Token is missing")
        }
    },timeout)

    it('Successfull database read', async () => {
        const result = await getRefreshToken(id)
        console.log(result)
        expect(result).toBeDefined();
        expect(result.token).toBeDefined()
  
      }, timeout)
})

describe('Database addRefreshToken', () => {
    

    it('Unsuccessful database save', async () => {
        id = "fasdfasdfsa"
        try{
            await addRefreshToken(id,null)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("Something went wrong")
        }
    },timeout)
    
    it('Successfull database save', async () => {
        const result = await addRefreshToken(id,token)
        console.log(result)
        expect(result).toBeDefined();
        expect(result.result).toBe("Data has been added")
  
      }, timeout)
})