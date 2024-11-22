const message = require('./../models/messageModel');
const user = require('./../models/userModel');
const { Op } = require('sequelize');


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



exports.getChats = async (req, res, next) => {
    console.log('message id', req.query.lastMessageId);

    try {
        const lastMessageId = req.query.lastMessageId;
        let whereClause = {};

        // If lastMessageId is valid, set the where clause
        if (lastMessageId && !isNaN(lastMessageId)) {
            whereClause.id = { [Op.gt]: lastMessageId };  // Fetch messages greater than lastMessageId
        }

        // Fetch 10 messages (either from the latest or based on lastMessageId)
        const messages = await message.findAll({
            where: whereClause,
            include: [
                {
                    model: user,
                    attributes: ['name']
                },
            ],
            attributes: ['message', 'id'],
            limit: 10,  // Limit the results to 10 messages
            order: [['id', 'DESC']]  // Order by id descending to get the most recent messages first
        });

        // If no messages are found, return a 404 response
        if (messages.length === 0) {
            return res.status(404).json({ message: 'No chats yet' });
        }

        // Reverse the messages to return them in ascending order (oldest first)
        const reversedMessages = messages.reverse();
        const chats = reversedMessages.map((element) => ({
            message: element.message,
            name: element.user.name
        }));

        // Get the latest message ID from the reversed messages
        const latestMessageId = reversedMessages[reversedMessages.length - 1].id;

        return res.status(200).json({
            messages: chats,
            latestMessageId: latestMessageId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
