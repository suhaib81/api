'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const s3 = require('../utils/s3');

module.exports = { create };

function create(upload) {
  let signedUrl = s3.createSignedUrl(upload);
  return models.Uploads.create({
      uploadId: signedUrl.uploadId,
      name: upload.name,
      type: upload.type
    })
    .then(() => Promise.resolve(signedUrl));
}

function remove(upload) {

}
