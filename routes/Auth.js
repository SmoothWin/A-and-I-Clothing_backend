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
        const {firstName, lastName, email, password,
                phoneCountryCode, phoneNumber,
                address, buildingNumber, city, country,
                postalCode, organizationName
         } = req.body;
        const modifiedPhoneNumber = phoneNumber.replace(/(-| |\.|_|())/,"") //to pass into the sql
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(null, firstName, lastName, email, hashedPassword,
            "customer", phoneCountryCode, modifiedPhoneNumber, address, (buildingNumber != '')?buildingNumber:null,
            city, country, postalCode, (organizationName != '')?organizationName:null, null);
            
        const savedUser = await authentication.insertUser(user)
        console.log(savedUser)
        // if(typeof savedUser == "Error")
        // throw savedUser
        res.json(savedUser);
    } catch(e) {
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