const jwt = require('jsonwebtoken');


exports.generateToken =(id,email)=>{
    const payload = {
        id : id ,
        email : email,
    }
    const secret = "oisjcfnjdhr7238q9ufh"
    return jwt.sign(payload,secret)
}