const express = require('express');
const route = express.Router();

const authenticate = require('../middlewares/auth');
const getGroupDetails = require('./../middlewares/groupDetails');

const adminControle = require('../controller/adminControle');

const chatControle = require('./../controller/chatControle')

route.get('/loadDetails',express.json(), express.urlencoded({ extended: true }),authenticate,getGroupDetails,adminControle.loadDetails);

route.post('/addNewMembers',express.json(), express.urlencoded({ extended: true }),authenticate,getGroupDetails,adminControle.addNewMembers);

route.post('/removeMembers',express.json(), express.urlencoded({ extended: true }),authenticate,getGroupDetails,adminControle.removeMembers);

route.post('/makeAdmin',express.json(), express.urlencoded({ extended: true }),authenticate,getGroupDetails,adminControle.addAdmins);

route.post('/removeAdmin',express.json(), express.urlencoded({ extended: true }),authenticate,getGroupDetails,adminControle.removeAdmin);

module.exports = route;