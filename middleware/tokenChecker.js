const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
  const token = req.cookies.token
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'Something Went Wrong'
    });
  }
}