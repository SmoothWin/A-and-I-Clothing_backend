const con = require('./connection')

function insertBigOrders(userid,csvData){
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
        console.log("Hello: "+result)
        return result
    })
}

module.exports = insertBigOrders
