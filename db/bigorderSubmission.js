const con = require('./connection')

async function insertBigOrders(userid, csvData, test = false){
    let table = "big_orders";
    if(test){
        table = "big_orders_test";
    }
    let handledData = csvData.map(x=>[userid].concat(x))
    const query = new Promise((resolve)=>{
        con.query({
            sql:'INSERT INTO '+
                `${table} (user_id, product, quantity, color, description_of_design)`+
                ` VALUES ?`,
            timeout: 10000
        }, [handledData], async (err, result)=>{
            if(err){
                console.log(err.errno)
                return resolve({"result":err.errno, "error":true})
            }
            console.log(`Inserted ${handledData.length} rows of data`)
            
            return resolve({"result":"Big order has been processed and saved", "error":false})
        })
    })
    
    return query
    
}

module.exports = insertBigOrders
