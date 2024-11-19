const bcrypt = require('bcrypt');

const user = require('./../models/userModel')

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