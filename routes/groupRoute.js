const express = require('express');
const route = express.Router();

const authenticate = require('../middlewares/auth');
const getGroupDetails = require('./../middlewares/groupDetails');

const groupControle = require('../controller/groupControle');

const chatControle = require('./../controller/chatControle')

route.post('/createGroup',express.json(), express.urlencoded({ extended: true }),authenticate,groupControle.createGroup);
route.use('/getAllUsers',express.json(), express.urlencoded({ extended: true }),authenticate,groupControle.getAllUsers);
route.get('/getAllGroups',express.json(), express.urlencoded({ extended: true }),authenticate,groupControle.getAllGroups);
route.post('/getchat',express.json(), express.urlencoded({ extended: true }),authenticate, groupControle.getChat);
route.post('/postchat',express.json(), express.urlencoded({ extended: true }),authenticate,getGroupDetails,groupControle.posthat);


module.exports = route;    