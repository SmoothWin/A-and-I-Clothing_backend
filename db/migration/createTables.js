const con = require('../connection')

con.connect(function(err) {
    console.log(process.env.DB_HOST)
    if (err) throw err;
    console.log("Connected!");
    
    con.query(`CREATE TABLE users (
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
                      console.log(err)
                        console.error("Table 'users' already exists")
                        return
                        }
                    console.log("Table 'users' created")
                    })
      con.query(`CREATE TABLE big_orders (
                    id int NOT NULL AUTO_INCREMENT,
                    order_id varchar(40) UNIQUE NOT NULL default(TO_BASE64(UNHEX(REPLACE(UUID(),'-','')))),
                    user_id varchar(40) UNIQUE NOT NULL,
                    product varchar(255) NOT NULL,
                    quantity int unsigned,
                    color varchar(255),
                    description_of_design text null default null,
                    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    )`, (err, result) =>{
                      if(err) {
                        console.log(err)
                        console.error("Table 'big_orders' already exists")
                        return
                        }
                      console.log("Table 'big_orders' created")
                    })
      con.end();
  });