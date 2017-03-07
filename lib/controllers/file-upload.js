'use strict';

const Promise = require('bluebird');
const aws = require('aws-sdk');
const logger = require('../utils/logger');
const models = require('../models');
const fileUploadRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const validateRequest = require('../utils/validate-request');
const errorHandling = require('../utils/error-handling');

aws.config.setPromisesDependency(Promise);
const s3 = new aws.S3();

fileUploadRouter
  .post('/', authGuard('user'), (req, res) => {
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
        return s3.getSignedUrl('putObject', s3Params);
      })
      .then(data => {
        console.log(data);
        res.status(201).send(data);
      })
      .catch(errorHandling.catchAndRespond(req, res));
  });

module.exports = fileUploadRouter;
