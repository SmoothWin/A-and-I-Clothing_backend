const Joi = require('joi')
const schema = Joi.object({
    firstName:Joi.string().min(2).regex(/^[A-Za-z]+$/).required(),
    lastName:Joi.string().min(2).regex(/^[A-Za-z]+$/).required(),
    email:Joi.string().email({ minDomainSegments: 2}).required(),
    password:Joi.string().regex(/"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"/),
    phoneCountryCode:Joi.string().regex(/^[0-9]{3}$/).required(),
    phoneNumber: Joi.string().length(10).regex(/\d{10}/).required(),
    address: Joi.string().regex(/\d{1,}(\s{1}\w{1,})(\s{1}?\w{1,})+/).required(),
    buildingNumber: Joi.string().regex(/[0-9]+/),
    city:Joi.string().regex(/^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/).required(),
    country:Joi.string().regex(/[a-zA-Z]{2,}/).required(),
    postalCode:Joi.string().required(),
    organizationName:Joi.string().alphanum()
})

class User{
    constructor(userId, firstName, lastName, email, password,
                role, phoneCountryCode, phoneNumber, address,
                buildingNumber, city, country, postalCode,
                organizationName, dateTime){
        
        let result = schema.validate({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
            phoneCountryCode:phoneCountryCode,
            phoneNumber:phoneNumber,
            address:address,
            buildingNumber:buildingNumber,
            city:city,
            country:country,
            postalCode:postalCode,
            organizationName:organizationName
        })
        if(result.error)
            throw new Error(result.error)

        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.buildingNumber = buildingNumber;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
        this.organizationName = organizationName;
        this.dateTime = dateTime;
    }

}
module.exports = User