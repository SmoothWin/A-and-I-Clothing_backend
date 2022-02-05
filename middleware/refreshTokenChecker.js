const jwt = require('jsonwebtoken')

//db imports
const {getRefreshToken} = require(__dirname+'/../db/tokenStorage')

module.exports = (req,res,next) => {
  try{
    const token = req.cookies.tokenR
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.REFRESH_SECRET, async function(err, decoded) {
        try{
          if (err) {
              return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
          }
          
        req.decodedR = decoded;
        
        //verify if token is in database
        const dbReturn = await getRefreshToken(decoded.userId)
        console.log(dbReturn)
        
        if(dbReturn?.token != token)
          throw new Error("R Token expired")
        next();
      }catch(e){
        return res.status(403).send({
            "error": true,
            "message": e.message
        });
      }
        
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
          "error": true,
          "message": 'Something went wrong'
      });
    }
  }catch(e){
    return res.status(403).send({
        "error": true,
        "message": e.message
    });
  }
}