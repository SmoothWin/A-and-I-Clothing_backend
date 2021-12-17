const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

//custom imports
const User = require('../db/models/user')
const authentication = require('../db/authentication')

router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const {firstName, lastName, email, password, confirmpassword,
                phoneCountryCode, phoneNumber,
                address, buildingNumber, city, country,
                postalCode, organizationName
         } = req.body;

        const schemaPass = Joi.object({
            password:Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        })
        const result = schemaPass.validate({password:password.trim()})

        if(result.error)
        throw new Error("Password is invalid")

        if(password != confirmpassword)
         throw new Error("Passwords don't match")
       
        const modifiedPhoneNumber = phoneNumber.replace(/(-| |\.|_|())/g,"") //to pass into the sql
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        
        const user = new User(null, toCapitalThenLower(firstName.trim()), toCapitalThenLower(lastName.trim()), email.trim(), hashedPassword,
            "customer", phoneCountryCode.trim(), modifiedPhoneNumber.trim(), address.trim(), (buildingNumber != '')?buildingNumber.trim():null,
            city.trim(), country.trim(), postalCode.trim(), (organizationName != '')?organizationName.trim():null, null);
            
        const savedUser = await authentication.insertUser(user)
        console.log(savedUser)

        return res.json(savedUser.result);
    } catch(e) {
        console.log("\n"+e.message)
        res.status(400).json({ message: "Error"});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    const schema = Joi.object({
        email:Joi.string().email({ minDomainSegments: 2}).required(),
        password:Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    })
    try{
        const validationResult = schema.validate({email:email, password:password})
        if(validationResult.error)
            throw new Error(validationResult.error)
        const user = await authentication.getUserInfo(email)
        console.log(user.user)
    
        const match = await bcrypt.compare(password, user.password);
        const accessToken = jwt.sign(JSON.parse(JSON.stringify(user.user)), process.env.TOKEN_SECRET,{expiresIn:process.env.TOKEN_EXPIRATION})
        if(match){
            console.log(process.env.APP_ENVIRONMENT)
            if(process.env.APP_ENVIRONMENT == "development")
            res.cookie("token", accessToken,{httpOnly:true,secure:false,sameSite:"none", maxAge:process.env.TOKEN_EXPIRATION}).json({"message":"Welcome", firstName:user.user.firstName, lastName:user.user.lastName});
            else
            res.cookie("token", accessToken,{httpOnly:true,secure:true,sameSite:"none", maxAge:process.env.TOKEN_EXPIRATION}).json({"message":"Welcome", firstName:user.user.firstName, lastName:user.user.lastName});
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch(e) {
        console.log(e.message)
        res.status(400).json({message: "Invalid Credentials"})
    }
});

/**
 * @param {string} value //value to pass in order to follow this format: aptitude -> Aptitude
 */
function toCapitalThenLower(value){
    let v = value.toLowerCase()
    let vString = v.substring(1)
    let vChar = v[0].toUpperCase()
    return vChar+vString
}

module.exports = router