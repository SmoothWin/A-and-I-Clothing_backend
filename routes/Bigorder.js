const express = require('express')
const router = express.Router()

//custom files
const bigorderSubmission = require('../db/bigorderSubmission')
const tokenChecker = require('../middleware/tokenChecker')
const multer = require('multer')

const csv = require('csv-parser')
const fs = require('fs')
const {promisify} = require('util')

const unlinkAsync = promisify(fs.unlink)
const upload = multer({ dest: '../uploads/tmp/bigorders' });


let dummyUserId = "1b55e0565af111ec99de0862662c2bec" //to remove in production

router.use(tokenChecker)

router.get('/', async (req,res)=>{
    const decodedJWT = req.decoded;
    if(decodedJWT.role)
        return res.status(200).send({"message":"User is allowed"});
    return res.status(401).send({"message":"Unauthorized access"});
                // {"userId":result[0]["user_id"],"firstName":result[0]["first_name"],
                //          "lastName": result[0]["last_name"], "role":result[0]["role"]}
})

router.post('/upload', upload.single('file'), async (req, res)=>{
    
    const results = []
    let message
    // console.log(req.file)
    
    if (!req.file) {
        return res.status(400).send({"message":"No files were uploaded."});
    }
    if (req.file)
    try{
        let invalidFile = false;
        fs.createReadStream(req.file.path).pipe(csv())
                .on('data', (data)=> {
                    let value = {
                        "product":data["product"],
                        "quantity":data["quantity"],
                        "color":data["color"],
                        "description of design":data["description of design"]
                    }
                    if(typeof data["product"] == "undefined",
                        typeof data["quantity"] == "undefined",
                        typeof data["color"] == "undefined",
                        typeof data["description of design"] == "undefined")
                        invalidFile = true;
                    results.push(value)
                    // console.log(results)
                })
                .on('end', async ()=>{
                    // console.log(results.map(x => Object.values(x)))
                await unlinkAsync(req.file.path)
                if(invalidFile){
                    return res.status(400).send({"message":"Something is wrong with the file"})
                }
                // console.log(results.length)
                message = await bigorderSubmission(dummyUserId, results.map(x => Object.values(x)))
                console.log(message.result)
                
                console.log(results)
                if(results.length == 0)
                    return res.status(400).send({"message":"No orders were attached to the file"})
                if(message.result == 1366)
                    return res.status(400).send({"message":"Quantity for big orders in the csv needs to be in \"integer\" digits"})
                return res.status(200).send({"message": "Big order reviewed and submitted"});
                })
                
    
    }catch(e){
        // console.log(e)
        await unlinkAsync(req.file.path)
        return res.status(400).send({"message":"Something went wrong with reading the file"})
    }
})

module.exports = router