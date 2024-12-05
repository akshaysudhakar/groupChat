const express = require('express');
const route = express.Router();

const authenticate = require('../middlewares/auth');
const getGroupDetails = require('./../middlewares/groupDetails');

const multer = require('multer');

const fileSharingControle = require('./../controller/fileSharingControle')

const upload = multer({ storage: multer.memoryStorage() }); 

route.post('/sendFile',upload.single('file'),authenticate,getGroupDetails,fileSharingControle.uploadToS3 );

module.exports = route;