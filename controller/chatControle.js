const message = require('./../models/messageModel');


exports.postChats = async (req,res,next) => {
    const userId = req.user.id;
    const data = {
        message : req.body.message,
        userId : userId
    }
    try{
        await message.create(data);

        res.status(200).json({message : "chat delivered"})
       
    }catch(err){
        console.log(err)
        res.status(500).json({message : "internal server error"})
    }
}

exports.getChats = async (req,res,next) => {
    return res.status(200).json({message : "success"})
}