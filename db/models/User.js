class User{
    constructor(userId, firstName, lastName, email, password,
                role, phoneCountryCode, phoneNumber, address,
                buildingNumber, city, country, postalCode,
                organizationName, dateTime){

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