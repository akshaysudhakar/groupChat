const express = require('express');
const route = express.Router();

const authenticate = require('./../middlewares/auth')

const chatControle = require('./../controller/chatControle')

route.use('/postchat',express.json(), express.urlencoded({ extended: true }),authenticate,chatControle.postChats);

route.use('/getchat',express.json(), express.urlencoded({ extended: true }),authenticate,chatControle.getChats)

module.exports = route;