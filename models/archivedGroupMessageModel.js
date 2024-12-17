const Sequelize = require('sequelize');
const sequelize = require('./../util/database');

const archivedGroupMessageModel = sequelize.define('archivedGroupMessages',{
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

module.exports = archivedGroupMessageModel;