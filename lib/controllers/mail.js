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
  mail.send(req.body.label, req.body, function (error, response) {
    if (error) {
      errorHandling.rejectWithStatus(403, error)
    } else {
      responseHandling.success(res, response)
    }
  })
});

module.exports = mailRouter;
