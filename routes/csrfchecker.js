const express = require('express')
const router = express.Router()

router.get("/validator/checker", async (req, res)=>{
    try{
        return res.json({"token":req.csrfToken()})
    }catch(e){
        console.log(e)
        return res.status(401).json({"token":req.csrfToken()});
    }
})

module.exports = router