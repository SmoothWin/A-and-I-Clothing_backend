const Joi = require('joi')
const schema = Joi.object({
    firstName:Joi.string().min(2).regex(/^[A-Za-z]+$/).required(),
    lastName:Joi.string().min(2).regex(/^[A-Za-z]+$/).required(),
    email:Joi.string().email({ minDomainSegments: 2}).required(),
    phoneCountryCode:Joi.string().regex(/^[0-9]{1,3}$/).required(),
    phoneNumber: Joi.string().length(10).regex(/\d{10}/).required(),
    address: Joi.string().regex(/\d{1,}(\s{1}\w{1,})(\s{1}?\w{1,})+/).required(),
    buildingNumber: Joi.string().allow(null).regex(/^[0-9]+$/),
    city:Joi.string().regex(/^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/).required(),
    country:Joi.string().regex(/^[a-zA-Z]{2,}$/).required(),
    postalCode:Joi.string().min(5).required(),
    organizationName:Joi.string().allow(null).min(2)
})

class User{
    /**
     * @param {string} userId The user id normally it should be null for insertions
     * @param {string} firstName The first name string
     * @param {string} lastName The last name string
     * @param {string} email The email string
     * @param {string} password The password string
     * @param {string} role The role string
     * @param {string} phoneCountryCode The phoneCountryCode string
     * @param {string} phoneNumber The phoneNumber string
     * @param {string} address The address string
     * @param {string} buildingNumber The buildingNumber string can be null
     * @param {string} city The city string
     * @param {string} country The country string
     * @param {string} postalCode The postalCode string
     * @param {string} organizationName The organizationName string can be null
     * @param {Date} dateTime The dateTime Date Object should be null: database should set this automatically
     */
    constructor(userId, firstName, lastName, email, password,
                role, phoneCountryCode, phoneNumber, address,
                buildingNumber, city, country, postalCode,
                organizationName, dateTime){
        
        let result = schema.validate({
            firstName:firstName,
            lastName:lastName,
            email:email,
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
            throw new Joi.ValidationError(result.error)

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