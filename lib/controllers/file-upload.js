'use strict';

const Promise = require('bluebird');
const aws = require('aws-sdk');
const logger = require('../utils/logger');
const models = require('../models');
const fileUploadRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const validateRequest = require('../utils/validate-request');
const errorHandling = require('../utils/error-handling');

const s3 = new aws.S3();

console.log(s3);

fileUploadRouter
  .post('/', (req, res) => {
    validateRequest(req, {
        'fileName': { in : 'body', notEmpty: true },
        'fileType': { in : 'body', notEmpty: true }
      })
      .then(response => {
        const s3Params = {
          Bucket: 'oe-static-dev',
          Key: req.body['fileName'],
          Expires: 60,
          ContentType: req.body['fileType'],
          ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (error, data) => {
          if (error) {
            return Promise.reject(error);
          }
          console.log(data);
          res.status(201).json(data);
        });
      })
      .catch(errorHandling.catchAndRespond(req, res));
  });

module.exports = fileUploadRouter;
