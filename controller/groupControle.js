const message = require('./../models/messageModel');
const groupMessage = require('./../models/groupMessageModel');
const user = require('./../models/userModel');
const group = require('./../models/groupModel');
const userGroup = require('./../models/userGroupModel');
const tokenVerify = require("../util/helpers")

const { Op } = require('sequelize');

exports.getAllUsers = async (req,res,next) => {
    try{
        const allUsers = await user.findAll({
            attributes: ['name']  // Only select the 'username' field
          });

        res.status(200).json({users : allUsers})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : 'internal server error while loading users'})
    }
    
}

exports.getAllGroups = async (req,res,next) => {
    try{
        const userId = req.user.id;
        const allGroups = await group.findAll({
        attributes: ['name'], // Only select the 'name' field
        include: [{
            model: user,
            where: { id: userId }, // Filter groups where the user is a member
            attributes: [] // Exclude user attributes from the result
        }]
});

        res.status(200).json({groups : allGroups})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : 'internal server error while loading users'})
    }   
}

exports.getChat = async (req,res,next)=>{
    console.log('group name', req.body.groupName)
    const groupName = req.body.groupName;
    const userId = req.user.id;
    try {
        const lastMessageId = req.query.lastMessageId;
        const groupId = await group.findOne({where : {name : groupName}})
        if (!groupId) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        console.log(groupId.id)

        const usergroup = await userGroup.findOne({
            where: {
                userId: userId,
                groupId: groupId.id,
                isAdmin: true  // Check if the user is an admin
            }
        });

        

        let whereClause = {groupId : groupId.id};

        // If lastMessageId is valid, set the where clause
        if (lastMessageId && !isNaN(lastMessageId)) {
            whereClause.id = { [Op.gt]: lastMessageId };  // Fetch messages greater than lastMessageId
        }

        // Fetch 10 messages (either from the latest or based on lastMessageId)
        const messages = await groupMessage.findAll({
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

         //generate a token to store group details
         const groupToken = tokenVerify.generateToken(groupId.id,groupName)

         const data = {
            groupToken : groupToken,
            isAdmin : false,
         }

         if(usergroup){
            data.isAdmin = true;
         }

        // If no messages are found, return a 404 response
        if (messages.length === 0) {
            data.message = 'No chats yet';
            return res.status(404).json(data);
        }

        // Reverse the messages to return them in ascending order (oldest first)
        const reversedMessages = messages.reverse();
        const chats = reversedMessages.map((element) => ({
            message: element.message,
            name: element.user.name
        }));

        data.messages = chats; //add chats to the data to be sent


        // Get the latest message ID from the reversed messages
        const latestMessageId = reversedMessages[reversedMessages.length - 1].id;

        data.latestMessageId = latestMessageId; //add lastMessageId to the data to be snet

        return res.status(200).json(data);
           
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error in getchat' });
    }
};

exports.posthat = async (req,res,next) => {
    const userId = req.user.id;
    const groupId = req.group.id;
    const data = {
        message : req.body.message,
        userId : userId,
        groupId : groupId
    }
    try{
        await groupMessage.create(data);

        res.status(200).json({message : "chat delivered"})
       
    }catch(err){
        console.log(err)
        res.status(500).json({message : "internal server error in postchat"})
    }
}

exports.createGroup = async (req,res,next) => {
    console.log(req.user)
    const adminId = req.user.id;
    console.log('request entered')
    const name = req.body.name;
    const description = req.body.description
    const memberNames = req.body.members;
    const groupDetails = {
        name : name,
        description :description
    }
    try{
        const newGroup = await group.create(groupDetails)

        // Step 2: Fetch users by their usernames
        const users = await user.findAll({
        where: {
          name: memberNames, // memberNames should be an array of usernames
        },
      });
  
      // Step 3: Extract user IDs from the fetched users
      const memberIds = users.map(user => user.id);
  
      // Step 4: Associate users with the group
      await newGroup.addUsers(memberIds);

      await userGroup.update(
        { isAdmin: true },  // Update isAdmin to true
        {
          where: {
            userId: adminId,
            groupId: newGroup.id,  
          },
        }
      );

      res.status(200).json({message : 'new group has been created'})

    }
    catch(err){
        res.status(500).json('error creating a new group')
        console.log(err)
    }
}