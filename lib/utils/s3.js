'use strict';

const aws = require('aws-sdk');
const crypto = require('crypto');
aws.config.setPromisesDependency(Promise);
const s3 = new aws.S3({
  endpoint: 's3-eu-central-1.amazonaws.com',
  signatureVersion: 'v4',
  region: 'eu-central-1'
});

const bucketAddress = `https://s3-eu-central-1.amazonaws.com/${process.env.S3_BUCKET}/`;

function createSignedUrl(upload) {
  // access to s3 bucket on the specific uuid using the PUT method
  // assign random uuid to new file
  const uploadId = crypto.randomBytes(20).toString('hex');
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET,
    Key: uploadId,
    // Signed url expires after 60 seconds
    Expires: 60,
    // ContentEncoding: 'base64',
    ContentType: upload.type,
    ACL: 'public-read'
  });
  return {
    name: upload.name,
    type: upload.type,
    uploadId: uploadId,
    url: bucketAddress + uploadId,
    signedUrl: signedUrl
  }
}

module.exports = { createSignedUrl, bucketAddress };
