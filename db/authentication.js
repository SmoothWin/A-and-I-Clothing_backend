const User = require(__dirname+'/../db/models/user')
const con = require(__dirname+'/connection')

/**
 * @param {User} user The user object
 */
function registerUser(user){
    return new Promise((res, rej) => {
        const userParamList = [user.firstName, user.lastName, user.email, user.password,
            user.role, user.phoneCountryCode, user.phoneNumber, user.address,user.buildingNumber,
            user.city, user.country, user.postalCode, user.organizationName]
        con.query({ //done for testing purposes remove in production
            sql:
            'INSERT INTO USERS(first_name, last_name, email, password, role, phone_country_code,'+
                    'phone_number, address, building_number, city, country, postal_code, organization_name)'+
                    ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
            timeout:10000
            }, userParamList
            , (err, result)=>{
            if(err){
                return rej(new Error("Something went wrong with registering the user"))
            }
                return res({"result":"User is registered", "user": {"firstName":user.firstName, "lastName": user.lastName}, "error":false})
            })
    })
    
}

/**
 * @param {string} id The user_id string
 */
 function getUserById(id){
    const userLoginParamList = [id]
    return new Promise((res, rej)=>{con.query({ //done for testing purposes remove in production
            sql:
            'SELECT first_name, last_name FROM USERS WHERE user_id = ?',
            timeout:10000
            }, userLoginParamList
            , (err, result)=>{
            if(err){
                // console.log(err)
                return rej(new Error("Something went wrong with fetching user info"))
            }
            if(typeof result == "undefined"){
                // console.log(err)
                return rej(new Error("User is missing"))
            }
            if(result.length < 1){
                return rej(new Error("User is missing"))
            }
            console.log(result[0])
            return res({
             "user": {"firstName":result[0]["first_name"],
             "lastName": result[0]["last_name"]}})
            })
        })
 }


/**
 * @param {string} email The email string
 */
function getUser(email){
    const userLoginParamList = [email]
    return new Promise((res, rej)=>{con.query({ //done for testing purposes remove in production
            sql:
            'SELECT user_id, first_name, last_name, password, role FROM USERS WHERE email = ?',
            timeout:10000
            }, userLoginParamList
            , (err, result)=>{
            if(err){
                // console.log(err)
                return rej(new Error("Something went wrong with fetching user info"))
            }
            if(typeof result == "undefined"){
                // console.log(err)
                return rej(new Error("User is missing"))
            }
            if(result.length < 1){
                return rej(new Error("User is missing"))
            }
            // console.log(result)
            return res({"result":"Welcome", "password":result[0]["password"],
             "user": {"userId":result[0]["user_id"],"firstName":result[0]["first_name"],
             "lastName": result[0]["last_name"], "role":result[0]["role"]}, "error":false})
            })
        })
 }

 function getUserEmail(id){
    const userLoginParamList = [id]
    return new Promise((res, rej)=>{con.query({ //done for testing purposes remove in production
            sql:
            'SELECT email FROM USERS WHERE user_id = ?',
            timeout:10000
            }, userLoginParamList
            , (err, result)=>{
            if(err){
                // console.log(err)
                return rej(new Error("Something went wrong with fetching user info"))
            }
            if(typeof result == "undefined"){
                // console.log(err)
                return rej(new Error("User is missing"))
            }
            if(result.length < 1){
                return rej(new Error("User is missing"))
            }
            // console.log(result)
            return res({"email":result[0]["email"], "error":false})
            })
        })
 }


module.exports = {
    insertUser:registerUser,
    getUserInfo:getUser,
    getUserById: getUserById,
    getUserEmail:getUserEmail
}