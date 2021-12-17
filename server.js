require('dotenv').config()
const app = require('./index')
const port = process.env.SERVER_PORT

app.listen(port, ()=>{
    console.log("Running in "+process.env.APP_ENVIRONMENT+" mode")
    console.log(`A&I Clothing app backend listening on localhost:${port}`)
})