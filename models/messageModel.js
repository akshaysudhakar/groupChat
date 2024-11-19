const Sequelize = require('sequelize')
const sequelize = require('./../util/database');

const message_model = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message :{
        type : Sequelize.STRING,
        allowNull : false,
    }
})

module.exports = message_model;