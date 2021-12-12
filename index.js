require('dotenv').config()

const csv = require('csv-parser')
const fs = require('fs')
const {promisify} = require('util')

const unlinkAsync = promisify(fs.unlink)

const express = require('express')
const multer = require('multer')
const cors = require('cors');

//custom files
const bigorderSubmission = require('./db/bigorderSubmission')

const app = express()
const port = process.env.SERVER_PORT

const upload = multer({ dest: 'uploads/tmp/bigorders' });

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());

app.post('/bigorders/upload', upload.single('file'), async (req, res)=>{
    
    const results = []
    let message
    // console.log(req.file)
    let dummyUserId = "tSNlDFl7Eey2WAhiZiwr7A==" //to remove in production
    if (!req.file) {
        return res.status(400).send({"message":"No files were uploaded."});
    }
    try{
        fs.createReadStream(req.file.path).pipe(csv())
                .on('data', (data)=> {
                    let value = {
                        "product":data["product"],
                        "quantity":data["quantity"],
                        "color":data["color"],
                        "description of design":data["description of design"]
                    }
                   
                    results.push(value)
                    // console.log(results)
                })
                .on('end', async ()=>{
                    // console.log(results.map(x => Object.values(x)))
                await unlinkAsync(req.file.path)
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

app.listen(port, ()=>{
    console.log(`A&I Clothing app backend listening on localhost:${port}`)
})

module.exports = app