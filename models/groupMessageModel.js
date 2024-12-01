const Sequelize = require('sequelize');
const sequelize = require('./../util/database');

const groupMessageModel = sequelize.define('groupMessages',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type : Sequelize.STRING,
        allowNull : false,
    }
})

module.exports = groupMessageModel;