const express = require('express')
const path = require('path');
const http = require('http');
const fs = require('fs');

const sequelize = require('./util/database');

const app = express();

/*const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
*/
const user = require('./models/userModel');
const message = require('./models/messageModel');
const group = require('./models/groupModel');
const groupMessage = require('./models/groupMessageModel');
const userGroup = require('./models/userGroupModel');

const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const groupRoute = require('./routes/groupRoute')
const adminRoute = require('./routes/adminRoute');


/*const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
  };


app.use(cors({
    origin: '*' ,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Include credentials if necessary
}));
app.use(helmet());
app.use(compression());
*/
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
  .then(() => {
    console.log('Database synced successfully');

    // Create HTTPS server
    http.createServer(app).listen(3000,() => {
      console.log('Server is listening');
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
