'use strict';

const Promise = require('bluebird');
const uploadsRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const validateRequest = require('../utils/validate-request');
const errorHandling = require('../utils/error-handling');
const uploads = require('../services/uploads');
const s3 = require('../utils/s3');

const permittedFileTypes = ['image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

function validateUploads(uploads) {
	let error;
  if (!uploads.every(upload => upload.hasOwnProperty('name'))) {
    error = new Error('Missing field: name');
    error.status = 404;
    return Promise.reject(error);
  }
  if (!uploads.every(upload => upload.hasOwnProperty('type'))) {
    error = new Error('Missing field: type');
    error.status = 404;
    return Promise.reject(error);
  }
  if (!uploads.every(upload => permittedFileTypes.indexOf(upload.type) !== -1)) {
    error = new Error('Invalid file type');
    error.status = 415;
    return Promise.reject(error);
  }
  return Promise.resolve();
}

uploadsRouter
  .post('/', authGuard('user'), (req, res) => {
    validateRequest(req, { 'uploads': { in : 'body', notEmpty: true } })
      .then(() => validateUploads(req.body.uploads))
      .then(() => Promise.all(req.body.uploads.map(upload => uploads.create(upload))))
      .then(response => {
        res.status(201).json({ uploads: response });
      })
      .catch(errorHandling.catchAndRespond(req, res));
  });

module.exports = uploadsRouter;
