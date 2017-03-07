'use strict';

const Promise = require('bluebird');
const aws = require('aws-sdk');
const logger = require('../utils/logger');
const models = require('../models');
const fileUploadRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const validateRequest = require('../utils/validate-request');
const errorHandling = require('../utils/error-handling');
const crypto = require('crypto');

aws.config.setPromisesDependency(Promise);
const s3 = new aws.S3({
  endpoint: 's3-eu-central-1.amazonaws.com',
  signatureVersion: 'v4',
  region: 'eu-central-1'
});

fileUploadRouter
  .post('/', authGuard('user'), (req, res) => {
    validateRequest(req, {
        'filesMetaData': { in : 'body', notEmpty: true }
      })
      .then(() => {
        let signedUrls = req.body.filesMetaData.map(file => {
          const uuid = crypto.randomBytes(20).toString('hex');
          const signedUrl = s3.getSignedUrl('putObject', {
            Bucket: 'oe-static-dev',
            Key: uuid,
            Expires: 60,
            ContentType: req.body['fileType'],
            ACL: 'public-read'
          });
          return {
          	name: file.name,
          	uuid: uuid,
          	signedUrl: signedUrl
          }
        });
        res.status(201).json(signedUrls);
      })
      .catch(errorHandling.catchAndRespond(req, res));
  });

module.exports = fileUploadRouter;
