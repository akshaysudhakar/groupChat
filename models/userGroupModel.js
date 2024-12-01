const sequelize = require('./../util/database');
const Sequelize = require('sequelize');



const userGropupModel = sequelize.define('UserGroups', {
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,  // Default value is false, meaning the user is not an admin
    },
    isCreator: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,  // Default value is false, meaning the user is not an admin
    }
  });

  module.exports = userGropupModel;




