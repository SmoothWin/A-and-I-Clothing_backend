const con = require('./connection')

async function insertBigOrders(userid, csvData, test = false){
    let table = "big_orders";
    if(test){
        table = "big_orders_test";
    }
    let handledData = csvData.map(x=>[userid].concat(x))
    con.query({
        sql:'INSERT INTO '+
            `${table} (user_id, product, quantity, color, description_of_design)`+
            ` VALUES ?`,
        timeout: 10000
    }, [handledData], (err, result)=>{
        if(err){
            if(err.errno == 1452)
                console.log("user doesn't exist")
            if(err.errno == 1366)
                console.log("Quantity needs to be in non-decimal digits")
            console.log(err)
            return false
        }
        console.log(`Inserted ${handledData.length} rows of data`)
        return "Big order has been processed and saved"
    })
}

module.exports = insertBigOrders
