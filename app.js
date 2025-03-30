const express = require('express')
const path = require('path');
const http = require('http');
const fs = require('fs');

const socket = require('socket.io');

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
const archivedGroupMessage = require('./models/archivedGroupMessageModel');

const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const groupRoute = require('./routes/groupRoute')
const adminRoute = require('./routes/adminRoute');
const fileRoute = require('./routes/fileRoute');


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
app.use('/file',fileRoute);

message.belongsTo(user);
user.hasMany(message);

user.belongsToMany(group, { through: 'UserGroups' });
group.belongsToMany(user, { through: 'UserGroups' });

groupMessage.belongsTo(user);
archivedGroupMessage.belongsTo(user);

user.hasMany(groupMessage);
user.hasMany(archivedGroupMessage);

groupMessage.belongsTo(group);
archivedGroupMessage.belongsTo(group);

group.hasMany(archivedGroupMessage);
group.hasMany(groupMessage);



sequelize.sync({})
  .then(() => {
    console.log('Database synced successfully');

    // Create HTTPS server
    const server = http.createServer(app);

    const io = socket(server);

    io.on('connection', socket => {
      console.log('connected with',socket.id);
      socket.on('send-message', (message,room)=> {
        socket.to(room).emit('recieve-message', message)
      })

      socket.on('join-room', (room)=> {
        console.log('joining room by users',room)
        socket.join(room);
      })
    })
    
    server.listen(3000,() => {
      console.log('Server is listening in port 3000');
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
