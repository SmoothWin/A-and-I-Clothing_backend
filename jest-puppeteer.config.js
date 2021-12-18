console.log(process.env.ENDTEST)
if(process.env.ENDTEST != false){
    module.exports = {
        launch: { 
        headless: false, slowMo: 30,
        } 
    }
}else{
    module.exports = {
        launch: { 
            slowMo: 30,
        } 
    }
}