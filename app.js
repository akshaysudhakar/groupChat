const express = require('express')
const path = require('path');

const sequelize = require('./util/database');

const user = require('./models/userModel');
const message = require('./models/messageModel');
const group = require('./models/groupModel');
const groupMessage = require('./models/groupMessageModel');
const userGroup = require('./models/userGroupModel');

const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const groupRoute = require('./routes/groupRoute')
const adminRoute = require('./routes/adminRoute');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/chat',chatRoute);
app.use('/group',groupRoute);
app.use('/admin',adminRoute);

message.belongsTo(user);
user.hasMany(message);

user.belongsToMany(group, { through: 'UserGroups' });
group.belongsToMany(user, { through: 'UserGroups' });

groupMessage.belongsTo(user);
user.hasMany(groupMessage);
groupMessage.belongsTo(group);
group.hasMany(groupMessage);

sequelize.sync()
//sequelize.sync({force : true})
.then(()=>{
    console.log('database synced successfully')
    app.listen(4000,()=>{
        console.log('server is listening')
    }) 
})