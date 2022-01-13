function createTestTables(){
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
                        // console.log("Table 'users' already exists")
                    }else{
                    // console.log("Table 'users' created")
                    }
                    })
      con.query(`CREATE TABLE tokens (
                    id int NOT NULL AUTO_INCREMENT,
                    user_id varchar(40) UNIQUE NOT NULL default(REPLACE(UUID(),'-','')),
                    token text NULL default NULL,
                    PRIMARY KEY (id)
                    )`, (err, result) =>{
                    if(err) {
                        // console.log("Table 'tokens' already exists")
                    }else{
                    // console.log("Table 'tokens' created")
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
                    )`, (err, result) =>{
                      if(err) {
                        // console.log(err)
                        // console.log("Table 'big_orders' already exists")
                        }else{
                      // console.log("Table 'big_orders' created")
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
                        // console.log("Table 'shopping_cart' already exists")
                        }else{
                      // console.log("Table 'shopping_cart' created")
                    }
                  })
      con.query({
        sql:`INSERT INTO SHOPPING_CART(cart_id,user_id,cart_data)
                  VALUES(?,?,?)`,
        timeout:10000
      },["0ef5149b70c711ec82b40862662c2bec","2c0633d05dfe11ecbfc90862662c2bec",`{"items":[{"id":"Ks1IVbTT509aSb","active":true,"name":"glasses","description":"some dark glasses...","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfMWFOUko5aGY5WlVqQ1kxUkZxajlmeERI00tPgRtexx"],"metadata":{},"pricedata":{"id":"1KCHFfFGY0rqHsBfEwwOYf4J","active":true,"currency":"cad","price":200,"price_string":"200"},"quantity":3},{"id":"KqjRDEAuvmiD2Z","active":true,"name":"T-Shirt","description":"A nice T-Shirt","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfV0JXaExWWUdQdGhHRUVDYllDRlM2ejNW00YqEiyAj2"],"metadata":{"Color":"Red"},"pricedata":{"id":"1KB1yPFGY0rqHsBfN9mGAMWR","active":true,"currency":"cad","price":2999,"price_string":"2999"},"quantity":2},{"id":"Ks1H7T0qSTTghC","active":true,"name":"good time","description":"very dark time :(","images":["https://files.stripe.com/links/MDB8YWNjdF8xS0IxdXNGR1kwcnFIc0JmfGZsX3Rlc3RfUDdSWVN2THNKdWhQTkZST2E0Q3lKQkY000iE1XsyFz"],"metadata":{},"pricedata":{"id":"1KCHFAFGY0rqHsBfix8LIXEi","active":true,"currency":"cad","price":100,"price_string":"100"},"quantity":4}]}`],
      (err)=>{
        if(err){
          // console.log("Dummy cart item already exists")
       }else{
        //  console.log("Dummy cart item created")
       }
      })
      con.query({ //done for testing purposes remove in production
        sql:
        'INSERT INTO USERS(user_id, first_name, last_name, email, password, role, phone_country_code,'+
                'phone_number, address, building_number, city, country, postal_code, organization_name)'+
                ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        timeout:10000                                                       //Asd1234567890$
        }, ["2c0633d05dfe11ecbfc90862662c2bec","Ch", "Ch", "email5@a.com", "$2b$10$VgdxaqjOXhvu53/xFLZOYeK3h2IPdGv2qVWNMa0NllaDo0J4LVqqS",
         "customer", "1","3423244321", "32 street boulevard", null, "Pr", "Da", "s1232", null, ]
         , (err, result)=>{
           if(err){
              // console.log("Dummy user already exists")
           }else{
            //  console.log("Dummy user created")
           }
         })
  });
}
createTestTables()
module.exports = createTestTables