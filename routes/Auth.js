const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(null, firstName, lastName, email, hashedPassword,
            "customer", phoneCountryCode, phoneNumber, address, (buildingNumber != '')?buildingNumber:null,
            city, country, postalCode, (organizationName != '')?organizationName:null, null);
            
        const savedUser = await authentication.insertUser(user)
        res.json(savedUser);
    } catch(e) {
        console.log(e)
        res.json({ message: "Error"});
    }
});

module.exports = router