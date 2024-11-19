const express = require('express')
const path = require('path');

const sequelize = require('./util/database')

const userRoute = require('./routes/userRoute')

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute)


sequelize.sync().then(()=>{
    console.log('database synced successfully')
    app.listen(4000,()=>{
        console.log('server is listening')
    }) 
})
