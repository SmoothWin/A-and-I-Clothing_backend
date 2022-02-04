const rateLimit = require('express-rate-limit')
const express = require('express')
const router = express.Router()

//rate limit settings
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 13, // Limit each IP to 13 requests per `window` (here, per 15 minutes)
    message:
		'Too many requests made to submit a big order',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true,
    skipSuccessfulRequests:(process.env.TEST_ENVIRONMENT == "testing")?true:false,
})

//custom files
const bigorderSubmission = require(__dirname+'/../db/bigorderSubmission')
const tokenChecker = require(__dirname+'/../middleware/tokenChecker')
const multer = require('multer')

const csv = require('csv-parser')
const fs = require('fs')
const {promisify} = require('util')


const allowedMimes = ['text/csv','application/vnd.ms-excel',
                'text/plain', 'text/x-csv', 'application/csv', 'application/x-csv',
                'text/comma-separated-values', 'text/x-comma-separated-values']

const unlinkAsync = promisify(fs.unlink)
const upload = multer({ dest: __dirname+'/../tmp/uploads/tmp/bigorders',
                    limits:{files:1, fileSize:1024*1024},
                    fileFilter: (req, file, cb)=>{
                        if(allowedMimes.includes(file.mimetype.toLowerCase())){
                            cb(null,true)
                        }
                        if(!(allowedMimes.includes(file.mimetype.toLowerCase()))){
                            cb(new Error("File is not supported"))
                        } else{
                            new Error("something is wrong with file")
                        }
                    },
                    });



router.use(tokenChecker)
router.use('/upload',apiLimiter)

router.post('/upload', upload.single('file'), async (req, res)=>{
    const decodedJWT = req.decoded;
    if(!decodedJWT?.role)
        return res.status(401).send({"message":"Unauthorized access"});

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
                message = await bigorderSubmission(decodedJWT?.userId, results.map(x => Object.values(x)))
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