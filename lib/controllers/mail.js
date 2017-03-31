'use strict';

var Promise = require('bluebird');
const mailRouter = require('express').Router();
const log = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const mail = require('../utils/mail');

const rejectWithStatus = errorHandling.rejectWithStatus;

mailRouter.post('/send', (req, res) => {
  responseHandling.success(res, {api:"test mail api"})
});

module.exports = mailRouter;
