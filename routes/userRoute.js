const express = require('express');

const userControle = require('../controller/userControle')

const route = express.Router()

route.post('/signup', express.json(), express.urlencoded({ extended: true }), userControle.signUp);

route.post('/login', express.json(), express.urlencoded({ extended: true }), userControle.login);

module.exports = route;