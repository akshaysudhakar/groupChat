const message = require('./../models/messageModel');
const user = require('./../models/userModel');


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
    try{
        const messages = await message.findAll({
            include : [
                {
                    model : user,
                    attributes : ['name']
                },
            ],
            attributes : ['message']
        })

        if(!messages){
            return res.status(404).json({message : 'no chats yet'})
        }
        else{
            console.log(messages)
            return res.status(200).json(messages);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : 'internal server error'})
    }
}