const message = require('./../models/messageModel');
const groupMessage = require('./../models/groupMessageModel');
const archivedGroupMessage = require('./../models/archivedGroupMessageModel');
const user = require('./../models/userModel');
const group = require('./../models/groupModel');
const userGroup = require('./../models/userGroupModel');
const tokenVerify = require("../util/helpers")

const { Op } = require('sequelize');

const cron = require('node-cron');

const sequelize = require('sequelize');


exports.loadDetails = async (req,res)=> {
    const userId = req.user.id;
    const groupId = req.group.id;
    try{
        const groupMembers = await user.findAll({
            include: {
              model: group,
              where: { id: groupId },
              through: {
                where: { isAdmin: false }, 
                attributes: [] 
              } 
            },
            attributes : ['name']
          })

          const groupAdmins = await user.findAll({
            include: {
              model: group,
              where: { id: groupId },
              through: {
                where: { isAdmin: true }, // Filter only admins
                attributes: [] // Exclude `UserGroups` join table fields
              }
            },
            attributes : ['name']
          });

          const allUsers = await user.findAll({
            attributes: ['id', 'name'], // Fetch user id and name
            where: {
              id: {
                [Op.notIn]: sequelize.literal(`
                  (SELECT userId FROM UserGroups WHERE groupId = ${groupId})
                `)
              }
            }
          });

          const groupDetails = await group.findOne({
            where : {id : groupId},
            attributes : ["name","description"]
          });

          res.status(200).json({groupMembers : groupMembers, groupAdmins : groupAdmins, allUsers:allUsers, groupDetails : groupDetails});

   }catch(err){
    console.log(err);
    res.status(500).json({message:"internal server error at loading details"})
   }
}

exports.addNewMembers= async (req,res)=> {
  const userId = req.user.id;
  const groupId = req.group.id;
  const memberNames = req.body.newMembers;
  try{
    const users = await user.findAll({
      where: {
        name: memberNames  // Array of names
      }
    });

    const Group = await group.findByPk(groupId);

    await Group.addUsers(users);

    res.status(200).json({message : "added new users successfully"});

  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "server error! try again after some time"})
  }
}

exports.removeMembers= async (req,res)=> {
  const userId = req.user.id;
  const groupId = req.group.id;
  const memberNames = req.body.removeMembers;
  try{
    const users = await user.findAll({
      where: {
        name: memberNames  // Array of names
      }
    });

    const Group = await group.findByPk(groupId);

    await Group.removeUsers(users);

    res.status(200).json({message : "removed selected users successfully"});

  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "server error! try again after some time"})
  }
}


exports.addAdmins= async (req,res)=> {
  const userId = req.user.id;
  const groupId = req.group.id;
  const memberNames = req.body.adminMembers;
  try{
    const users = await user.findAll({
      where: {
        name: memberNames  // Array of names
      }
    });

    const Group = await group.findByPk(groupId);

    await Promise.all(users.map(async (user) => {
      await userGroup.update(
        { isAdmin: true }, // Set isAdmin to true
        {
          where: {
            userId: user.id,
            groupId: groupId
          }
        }
      );
    }));

    res.status(200).json({message : "added selected users as admins successfully"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "server error! try again after some time"})
  }
}

exports.removeAdmin= async (req,res)=> {
  const userId = req.user.id;
  const groupId = req.group.id;
  const memberNames = req.body.adminName;
  try{
    const User = await user.findOne({
      where: {
        name: memberNames  // Array of names
      }
    });

    const [updatedRowCount] = await userGroup.update(
      { isAdmin: false }, // Set isAdmin to false
      {
        where: {
          userId: User.id,
          groupId: groupId,
          isCreator: false
        }
      }
    );

    if(!updatedRowCount){
      res.status(200).json({message : `cannot remove ${memberNames} as admin as he is the creator`});
    }

    res.status(200).json({message : `removed ${memberNames} as admin successfully`});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "server error! try again after some time"})
  }
}


cron.schedule('0 0 * * *', async () => {
  try {
    // Fetch all messages from the Chat table
    const allMessages = await groupMessage.findAll();

    if (allMessages.length === 0) {
      console.log('No messages to archive.');
      return;
    }

    // Move each message to the ArchivedChat table
    for (const message of allMessages) {
      // Create the archived message
      await archivedGroupMessage.create({
        message: message.message,
        userId: message.userId,  // Assuming userId is a foreign key for users
        groupId: message.groupId, // Assuming groupId is a foreign key for groups
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      });

      // After archiving, delete the message from the Chat table
      await message.destroy();
    }

    console.log('All messages archived successfully!');
  } catch (error) {
    console.error('Error archiving messages:', error);
  }
});



















