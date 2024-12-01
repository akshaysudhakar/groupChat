const jwt = require('jsonwebtoken');

require('dotenv').config()
const secret_key = process.env.USERID_SECRET_KEY;




const verifyToken  = (req,res,next)=> {
    const groupToken =  req.headers['grouptoken'];;
    jwt.verify(groupToken,secret_key, (error,decoded)=>{
        if (error){
            console.log(error)
            return res.status(401).json({message: `${groupToken},authentication error while getting group details, please try again`})
        }else {              
            req.group = decoded
            next()
        }
    })
}


module.exports = verifyToken;