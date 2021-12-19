console.log(process.env.ENDTEST)
if(process.env.ENDTEST != false){
    module.exports = {
        launch: { 
        headless: false, slowMo: 30,
        defaultViewport:{'width':1024, 'height':1600}
        } 
    }
}else{
    module.exports = {
        launch: { 
            slowMo: 30,
        } 
    }
}