const con = require('./connection')

const table = "shopping_cart";
async function addToCart(userid, cartData){
    return new Promise((res, rej)=>{
        con.query({
            sql:'INSERT INTO '+
                `${table} (user_id, cart_data)`+
                ` VALUES(?, ?)`,
            timeout: 10000
        }, [userid, cartData], async (err, result)=>{
            if(err){
                console.log(err.errno)
                return rej(new Error("Something went wrong"))
            }
            return res({"result":"Data has been added", "error":false})
        })
    })
    
}

async function getCartDataByUserId(userid){
    return new Promise((res, rej)=>{
        con.query({
            sql:'SELECT cart_id, user_id, cart_data FROM shopping_cart WHERE user_id = ?',
            timeout:10000
        }, [userid],
        (err, result)=>{
            if(err){
                return rej(new Error("Something went wrong"))
            }
            if(typeof result == "undefined"){
                return rej(new Error("Something went wrong"))
            }
            if(result.length < 1){
                return rej(new Error("Something went wrong"))
            }

            return res({
                "shopping_cart": {
                    "cart_id":result[0]["cart_id"],
                    "user_id":result[0]["user_id"],
                    "cart_data":result[0]["cart_data"]
                }
            })
        })
    })
}



module.exports = insertBigOrders