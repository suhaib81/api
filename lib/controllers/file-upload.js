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
      	// TODO: limit file types (probably .jpg, .png, .pdf)
      	// Returns an array of signed s3 urls, which allow users temporary
      	// access to s3 bucket on the specific uuid using the PUT method
        let signedUrls = req.body.filesMetaData.map(file => {
        	// assign random uuid
          const uuid = crypto.randomBytes(20).toString('hex');
          const signedUrl = s3.getSignedUrl('putObject', {
            Bucket: process.env.S3_BUCKET,
            Key: uuid,
            // Signed url expires after 60 seconds
            Expires: 60,
            // TODO:
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
