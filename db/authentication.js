const User = require('../db/models/user')
const conTest = require('./connection').test
const con = require('./connection').con

/**
 * @param {User} user The user object
 */
async function registerUser(user){
    const userParamList = [user.firstName, user.lastName, user.email, user.password,
        user.role, user.phoneCountryCode, user.phoneNumber, user.address,user.buildingNumber,
        user.city, user.country, user.postalCode, user.organizationName]
    const query = new Promise((resolve)=>{con.query({ //done for testing purposes remove in production
            sql:
            'INSERT INTO USERS(first_name, last_name, email, password, role, phone_country_code,'+
                    'phone_number, address, building_number, city, country, postal_code, organization_name)'+
                    ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
            timeout:10000
            }, userParamList
            , (err, result)=>{
            if(err){
                console.log(err)
                return resolve({"result": "something went wrong with the registration", "error":true})
            }
            return resolve({"result":"User is registered", "User": {"firstName":user.firstName, "lastName": user.lastName}, "error":false})
            })
        })
}


module.exports = {
    insertUser:registerUser,
    // test:registerUserTest,
}