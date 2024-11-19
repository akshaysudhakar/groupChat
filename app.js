const express = require('express')
const path = require('path');

const sequelize = require('./util/database');
const user = require('./models/userModel');
const message = require('./models/messageModel')

const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/chat',chatRoute);

message.belongsTo(user);
user.hasMany(message);

sequelize.sync()
//sequelize.sync({force : true})
.then(()=>{
    console.log('database synced successfully')
    app.listen(4000,()=>{
        console.log('server is listening')
    }) 
})
