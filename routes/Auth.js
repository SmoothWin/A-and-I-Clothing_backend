const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

//custom imports
const User = require('../db/models/user')
const authentication = require('../db/authentication')
const { escape } = require('mysql2')

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
        const result = schemaPass.validate({password:password})
        
        if(result.error)
        throw new Error("Password is invalid")

        if(password != confirmpassword)
         throw new Error("Passwords don't match")
       
        const modifiedPhoneNumber = phoneNumber.replace(/(-| |\.|_|())/,"") //to pass into the sql
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(null, firstName, lastName, email, hashedPassword,
            "customer", phoneCountryCode, modifiedPhoneNumber, address, (buildingNumber != '')?buildingNumber:null,
            city, country, postalCode, (organizationName != '')?organizationName:null, null);
            
        const savedUser = await authentication.insertUser(user)
        console.log(savedUser)

        return res.json(savedUser);
    } catch(e) {
        console.log("\n"+e.message)
        res.status(400).json({ message: "Error"});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    const user = await authentication.getUserInfo(email, password)
    console.log(user)
    
    try{
        const match = await bcrypt.compare(password, user.password);
        const accessToken = jwt.sign(JSON.stringify(user.user), process.env.TOKEN_SECRET)
        if(match){
            res.cookie("token", accessToken,{httpOnly:true,secure:true,sameSite:"none"}).json({ message: "Logged in" });
        } else {
            res.json({ message: "Invalid Credentials" });
        }
    } catch(e) {
        res.json({message: "Invalid Credentials"})
    }
});



module.exports = router