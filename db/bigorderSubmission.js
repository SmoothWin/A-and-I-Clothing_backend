const conTest = require('./connection').test
const con = require('./connection').con

const table = "big_orders";
    /* istanbul ignore next */
async function insertBigOrders(userid, csvData){
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

//test version
async function insertBigOrdersTest(userid, csvData){
    
    let handledData = csvData.map(x=>[userid].concat(x))
    const query = new Promise((resolve)=>{
        conTest.query({
            sql:'INSERT INTO '+
                `${table} (user_id, product, quantity, color, description_of_design)`+
                ` VALUES ?`,
            timeout: 10000
        }, [handledData], async (err, result)=>{
            if(err){
                console.log(err)
                return resolve({"result":err.errno, "error":true})
            }
            console.log(`Inserted ${handledData.length} rows of data`)
            
            return resolve({"result":"Big order has been processed and saved", "error":false})
        })
    })
    
    return query
    
}

module.exports = {
    insert:insertBigOrders,
    test:insertBigOrdersTest,
}

