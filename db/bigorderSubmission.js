const con = require('./connection')

async function insertBigOrders(userid,csvData){
    let handledData = csvData.map(x=>[userid].concat(x))
    con.query({
        sql:'INSERT INTO '+
            'big_orders (user_id, product, quantity, color, description_of_design)'+
            ` VALUES ?`,
        timeout: 10000
    }, [handledData], (err, result)=>{
        if(err){
            if(err.errno == 1452)
                console.log("user doesn't exist")
            console.log(err)
            return false
        }
        console.log(`Inserted ${handledData.length} rows of data`)
        return "Big order has been processed and saved"
    })
}

module.exports = insertBigOrders
