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
    // console.log(req.file)
    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }
    try{
        let results = []
        let message = ""
        await fs.createReadStream(req.file.path).pipe(csv())
                .on('data', (data)=>results.push(data))
                .on('end', async ()=>{
                    console.log(results.map(x => Object.values(x)))
                await unlinkAsync(req.file.path)
                if(results.length == 0)
                    return res.status(400).send("No orders were attached to the file")
                console.log(results.length)
                    message = bigorderSubmission("bruh",results.map(x => Object.values(x)))
                if(message == false)
                    return res.status(400).send("Incorrect .csv format")
                
                return res.status(200).send(message);
                })
    
    }catch(e){
        console.log(e)
        await unlinkAsync(req.file.path)
        return res.status(400).send("Something went wrong with reading the file")
    }
})

app.listen(port, ()=>{
    console.log(`A&I Clothing app backend listening on localhost:${port}`)
})