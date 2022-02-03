require('dotenv').config()
const app = require(__dirname+'/index')
const port = process.env.SERVER_PORT

app.listen(port, ()=>{
    console.log(`A&I Clothing app backend listening on localhost:${port}`)
})