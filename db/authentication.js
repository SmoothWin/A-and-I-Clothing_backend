const User = require('../db/models/user')
const conTest = require('./connection').test
const con = require('./connection').con

/**
 * @param {User} user The user object
 */
function registerUser(user){
    const userParamList = [user.firstName, user.lastName, user.email, user.password,
        user.role, user.phoneCountryCode, user.phoneNumber, user.address,user.buildingNumber,
        user.city, user.country, user.postalCode, user.organizationName]

    return new Promise((res, rej) => {
        con.query({ //done for testing purposes remove in production
            sql:
            'INSERT INTO USERS(first_name, last_name, email, password, role, phone_country_code,'+
                    'phone_number, address, building_number, city, country, postal_code, organization_name)'+
                    ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
            timeout:10000
            }, userParamList
            , (err, result)=>{
            if(err){
                return rej(Error("Something went wrong"))
            }
                return res({"result":"User is registered", "User": {"firstName":user.firstName, "lastName": user.lastName}, "error":false})
            })
    })
    
}

/**
 * @param {string} email The email string
 * @param {string} password The password string
 */
function getUser(email, password){
    const userLoginParamList = [email,password]
    return new Promise((res, rej)=>{con.query({ //done for testing purposes remove in production
            sql:
            'SELECT user_id, first_name, last_name, password, role FROM USERS WHERE email = ?',
            timeout:10000
            }, userLoginParamList
            , (err, result)=>{
            if(err){
                console.log(err)
                return rej(new Error("Something went wrong"))
            }
            console.log(result)
            return res({"result":"Welcome is logged in", "password":result[0]["password"],
             "user": {"userId":result[0]["user_id"],"firstName":result[0]["first_name"],
             "lastName": result[0]["last_name"], "role":result[0]["role"]}, "error":false})
            })
        })
 }

module.exports = {
    insertUser:registerUser,
    getUserInfo:getUser
    // test:registerUserTest,
}