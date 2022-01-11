const con = require('./connection')

const table = "tokens";
async function addRefreshToken(userid, token){
    return new Promise((res, rej)=>{
        con.query({
            sql:'INSERT INTO '+
                `${table} (user_id, token)`+
                ` VALUES(?, ?)`,
            timeout: 10000
        }, [userid, token], async (err, result)=>{
            if(err){
                console.log(err.errno)
                con.query({
                    sql:'UPDATE '+
                        `${table} set token = ? WHERE user_id = ?`,
                    timeout: 10000}, [token, userid],
                    async (err, result)=>{
                        if(err) 
                            return rej(new Error("Something went wrong"))
                        
                    })
            }
            return res({"result":"Data has been added", "error":false})
        })
    })
    
}

async function getRefreshToken(userid){
    return new Promise((res, rej)=>{
        con.query({
            sql:`SELECT user_id, token FROM ${table} WHERE user_id = ?`,
            timeout:10000
        }, [userid],
        (err, result)=>{
            if(err){
                return rej(new Error("Something went wront with fetching token data"))
            }
            if(typeof result == "undefined"){
                return rej(new Error("Token is missing"))
            }
            if(result.length < 1){
                return rej(new Error("Token is missing"))
            }

            return res({
                "token": result[0]["token"]
            })
        })
    
    })
}

module.exports = {
    addRefreshToken:addRefreshToken,
    getRefreshToken:getRefreshToken

}