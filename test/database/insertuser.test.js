const con = require('../../db/connection')

const createTestTables = require('../../db/migration/createTablesTest')
const User = require('../../db/models/User')
const insertUser = require('../../db/authentication').insertUser

const existingUser = new User(null, "Ch", "Ch", "email5@a.com", "dummypassword123$",
"customer", "1","3423244321", "32 street boulevard", null, "Pr", "Da", "s1232", null,)
const newUser = new User(null, "Ch", "Ch", "email@a.com", "dummypassword123$",
"customer", "1","3423244321", "32 street boulevard", null, "Pr", "Da", "s1232", null,)

beforeAll(()=>{
    createTestTables()
})

describe('Database insert user', () => {
    it('Successfull user insert', async () => {
      const result = await insertUser(newUser)
      expect(result).toBeDefined();
      expect(result.result).toBe("User is registered");
      expect(result.user).toBeDefined();
      con.query({
          sql:'DELETE FROM USERS WHERE email = ?',
          timeout:10000,
      }, [newUser.email])
    })

    it('User already exists', async () => {
        try{
            await insertUser(existingUser)
        }catch(e){
            expect(e.name).toBe("Error")
            expect(e.message).toBe("Something went wrong")
        }
    })
    it('User values are empty', async () => {
        try{
            await insertUser(null)
        }catch(e){
            expect(e.name).toBe("TypeError")
            expect(e.message).toContain("Cannot read properties of null")
        }
    })
})