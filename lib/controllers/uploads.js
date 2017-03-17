'use strict';

const Promise = require('bluebird');
const uploadsRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const validateRequest = require('../utils/validate-request');
const errorHandling = require('../utils/error-handling');
const uploads = require('../services/uploads');

uploadsRouter
  .post('/', authGuard('user'), (req, res) => {
    validateRequest(req, { 'uploads': { in : 'body', notEmpty: true } })
      .then(() => Promise.all(req.body.uploads.map(upload => uploads.create(upload))))
      .then(response => {
        res.status(201).json({ uploads: response });
      })
      .catch(errorHandling.catchAndRespond(req, res));
  });

module.exports = uploadsRouter;
