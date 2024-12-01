const Sequelize = require('sequelize');
const sequelize = require('./../util/database');

const groupModel = sequelize.define('groups',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type : Sequelize.STRING,
        allowNull : false,
    },
    description : {
        type : Sequelize.STRING,
        allowNull:false
    }
})

module.exports = groupModel;