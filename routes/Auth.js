const rateLimit = require('express-rate-limit')
const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

//custom imports
const User = require('../db/models/user')
const tokenChecker = require('../middleware/tokenChecker')
const refreshTokenChecker = require('../middleware/refreshTokenChecker')

//db call imports
const authentication = require('../db/authentication')
const {addRefreshToken} = require('../db/tokenStorage')

const registerLimit = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
    message:
		'Too many accounts were created during a short spam of time',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true,
})

const loginLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    message:
		'Too many login attempts were done during a short period of time',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: false,
})

router.post('/check', tokenChecker, async (req, res)=>{
    try{
        const decodedJWT = req.decoded
        if(decodedJWT)
            return res.json({"firstName":req.decoded.firstName, "lastName":req.decoded.lastName})
        return res.status(401).send();
    }catch(e){
        return res.status(401).send();
    }
})

router.post('/token', refreshTokenChecker, async (req, res)=>{
    try{
        const decodedRJWT = req.decodedR
        if(decodedRJWT){
            const accessToken = jwt.sign({
                userId: decodedRJWT.userId,
                firstName: decodedRJWT.firstName,
                lastName:decodedRJWT.lastName,
                role:decodedRJWT.role
            }, process.env.TOKEN_SECRET,{expiresIn:process.env.TOKEN_EXPIRATION})

            return res.cookie("token", accessToken,{httpOnly:true,secure:true,sameSite:"none", maxAge:process.env.TOKEN_EXPIRATION}).send()
        }
    }catch(e){
        return res.status(400).json({message: "Invalid"})
    }
})

router.post('/register', registerLimit, async (req, res) => {
    try {
        // console.log(req.body)
        const {firstName, lastName, email, password, confirmpassword,
                phoneCountryCode, phoneNumber,
                address, buildingNumber, city, country,
                postalCode, organizationName
         } = req.body;

        const schemaPass = Joi.object({
            password:Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        })
        const result = schemaPass.validate({password:password})

        if(result.error)
        throw new Error("Password is invalid")

        if(password != confirmpassword)
         throw new Error("Passwords don't match")
       
        const modifiedPhoneNumber = phoneNumber.replace(/(-| |\.|_|\(|\))/g,"") //to pass into the sql
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User(null, toCapitalThenLower(firstName.trim()), toCapitalThenLower(lastName.trim()), email.trim(), hashedPassword,
            "customer", phoneCountryCode.trim(), modifiedPhoneNumber.trim(), address.trim(), (buildingNumber != '')?buildingNumber:null,
            city.trim(), country.trim(), postalCode.trim(), (organizationName != '')?organizationName:null, null);
            
        const savedUser = await authentication.insertUser(user)
        // console.log(savedUser)

        return res.status(201).json(savedUser.result);
    } catch(e) {
        res.status(400).json({ message: e.message});
    }
});

router.post('/login', loginLimit, async (req, res) => {
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
        // console.log(user.user)
    
        const match = await bcrypt.compare(password, user.password);
        
        
        
        if(match){
            const accessToken = jwt.sign(JSON.parse(JSON.stringify(user.user)), process.env.TOKEN_SECRET,{expiresIn:process.env.TOKEN_EXPIRATION})
            const refreshToken = jwt.sign(JSON.parse(JSON.stringify(user.user)), process.env.REFRESH_SECRET, {expiresIn:process.env.REFRESH_EXPIRATION})
            
            //store refresh token in database method
            await addRefreshToken(user.user.userId, refreshToken)

            res.cookie("token", accessToken,{httpOnly:true,secure:true,sameSite:"none", maxAge:process.env.TOKEN_EXPIRATION})
            .cookie("tokenR", refreshToken,{httpOnly:true,secure:true,sameSite:"none", maxAge:process.env.REFRESH_EXPIRATION})
            .json({"message":"Welcome", firstName:user.user.firstName, lastName:user.user.lastName});
            
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch(e) {
        // console.log(e.message)
        return res.status(400).json({message: e.message})
    }
});



router.post('/logout', async (req, res)=>{
    try{
        return res.cookie("token", null, {maxAge:0, httpOnly:true, sameSite:'none', secure:true, path:"/"}).cookie("tokenR", null, {maxAge:0, httpOnly:true, sameSite:'none', secure:true, path:"/"}).send()
    }catch(e){
        console.log(e)
        res.status(401).json({message:"Logging out went wrong"})
    }
})

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