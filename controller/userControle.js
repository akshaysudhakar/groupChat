const bcrypt = require('bcrypt');

const user = require('./../models/userModel')
const tokenVerify = require("../util/helpers")

exports.signUp = async (req,res,next)=>{
    const data = req.body;
    console.log(req.body)
    try{
        const hashedPassword = await bcrypt.hash(data.password,10);

        data.password = hashedPassword

        const newUser = await user.create(data);

        res.status(200).json({message:'successfully created account'})

    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.json({ message: "an account already exists with this credentials" });
        } else {
            console.error('Error during user creation:', err);

            res.status(500).json({ message: "An error occurred while adding the user." });
        }
    }
}

exports.login = async (req,res,next) =>{
    const data = req.body
    try{ 
        const userToLogin = await user.findOne({where:{email : data.email}})

        if(!userToLogin){
            return res.status(404).json({message : "user not found"})
        }

        const ismatch = await bcrypt.compare(data.password,userToLogin.password)
        if(ismatch){
            const userToken = tokenVerify.generateToken(userToLogin.id,userToLogin.email)
            res.status(200).json({message : "login successful" , token : userToken})   
        }
        else{
            res.status(401).json({message : "incorrect password"})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : "server error, please try again"})
    }
}