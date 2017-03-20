'use strict';

const Promise = require('bluebird');
const uploadsRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const validateRequest = require('../utils/validate-request');
const errorHandling = require('../utils/error-handling');
const uploads = require('../services/uploads');
const s3 = require('../utils/s3');

uploadsRouter
  .post('/', authGuard('user'), (req, res) => {
    validateRequest(req, { 'uploads': { in : 'body', notEmpty: true } })
      .then(() => {
        if (req.body.uploads.every(upload => s3.validateFileType(upload.type))) {
          return Promise.resolve();
        } else {
          let error = new Error('Invalid file type');
          error.status = 415;
          return Promise.reject(error);
        }
      })
      .then(() => Promise.all(req.body.uploads.map(upload => uploads.create(upload))))
      .then(response => {
        res.status(201).json({ uploads: response });
      })
      .catch(errorHandling.catchAndRespond(req, res));
  });

module.exports = uploadsRouter;
