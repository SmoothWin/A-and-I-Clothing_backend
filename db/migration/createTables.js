const con = require('../connection')

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    con.query(`CREATE TABLE users (
                    id int NOT NULL AUTO_INCREMENT,
                    user_id varchar(40) UNIQUE NOT NULL default(REPLACE(UUID(),'-','')),
                    first_name varchar(35) NOT NULL,
                    last_name varchar(35) NOT NULL,
                    email varchar(255) UNIQUE NOT NULL,
                    password varchar(255) NOT NULL,
                    role varchar(10) NOT NULL,
                    phone_country_code varchar(3) NOT NULL,
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
                        console.log("Table 'users' already exists")
                    }else{
                    console.log("Table 'users' created")
                    }
                    })
      con.query(`CREATE TABLE tokens (
                    id int NOT NULL AUTO_INCREMENT,
                    user_id varchar(40) UNIQUE NOT NULL,
                    token text NULL default NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    )`, (err, result) =>{
                    if(err) {
                        console.log("Table 'tokens' already exists")
                    }else{
                    console.log("Table 'tokens' created")
                    }
                    })
      con.query(`CREATE TABLE shopping_cart (
                    id int NOT NULL AUTO_INCREMENT,
                    cart_id varchar(40) UNIQUE NOT NULL default(REPLACE(UUID(),'-','')),
                    user_id varchar(40) UNIQUE NOT NULL,
                    cart_data text default NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                    )`, (err, result) =>{
                      if(err) {
                        console.log("Table 'shopping_cart' already exists")
                        }else{
                      console.log("Table 'shopping_cart' created")
                    }
                  })
      con.query(`CREATE TABLE big_orders (
        id int NOT NULL AUTO_INCREMENT,
        order_id varchar(40) UNIQUE NOT NULL default(REPLACE(UUID(),'-','')),
        user_id varchar(40) NOT NULL,
        product varchar(255) NOT NULL,
        quantity int unsigned,
        color varchar(255),
        description_of_design text null default null,
        date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`, (err)=>{
          if(err) {
            console.log("Table 'shopping_cart' already exists")
            }else{
            console.log("Table 'shopping_cart' created")
            }
        })
      con.end();
  });