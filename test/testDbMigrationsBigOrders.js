const con = require('../db/connection')

con.connect(function(err) {
    console.log(process.env.DB_HOST)
    if (err) throw err;
    console.log("Connected!");
    
    con.query(`CREATE TABLE users_test (
                    id int NOT NULL AUTO_INCREMENT,
                    user_id varchar(40) UNIQUE NOT NULL default(TO_BASE64(UNHEX(REPLACE(UUID(),'-','')))),
                    first_name varchar(35) NOT NULL,
                    last_name varchar(35) NOT NULL,
                    email varchar(255) UNIQUE NOT NULL,
                    password varchar(255) NOT NULL,
                    role varchar(10) NOT NULL,
                    phone_country_code varchar(15) NOT NULL,
                    phone_number varchar(10) NULL DEFAULT NULL,
                    address varchar(255) NOT NULL,
                    building_number varchar(10) NULL DEFAULT NULL,
                    city varchar(200) NOT NULL,
                    country varchar(90) NOT NULL,
                    postal_code varchar(32) NOT NULL,
                    organization_name varchar(255) NULL DEFAULT NULL,
                    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                    )`, (err, result) =>{
                    if(err) {
                        console.error("Table 'users_test' already exists")
                    }else{
                    console.log("Table 'users_test' created")
                    }
                    })
      con.query(`CREATE TABLE big_orders_test (
                    id int NOT NULL AUTO_INCREMENT,
                    order_id varchar(40) UNIQUE NOT NULL default(TO_BASE64(UNHEX(REPLACE(UUID(),'-','')))),
                    user_id varchar(40) NOT NULL,
                    product varchar(255) NOT NULL,
                    quantity int unsigned,
                    color varchar(255),
                    description_of_design text null default null,
                    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    )`, (err, result) =>{
                      if(err) {
                        console.error("Table 'big_orders_test' already exists")
                        }else{
                      console.log("Table 'big_orders_test' created")
                    }
                  })
      con.query({ //done for testing purposes remove in production
        sql:
        'INSERT INTO USERS(user_id ,first_name, last_name, email, password, role, phone_country_code,'+
                'phone_number, address, building_number, city, country, postal_code, organization_name)'+
                ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        timeout:10000
        }, ["tSNlDFl7Eey2WAhiZiwr7A==","DummyFN", "DummyLN", "email@email.com", "strongpassword123",
         "customer", "1","4444444444", "115 element", null, "A city", "A country", "2j3mkj", null, ]
         , (err, result)=>{
           if(err){
              console.error("Dummy Test user already exists")
           }else{
             console.log("Dummy Test user created")
           }
         })
      con.end();
  });