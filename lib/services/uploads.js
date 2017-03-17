'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const s3 = require('../utils/s3');

module.exports = { create, update };

function create(upload) {
  let signedUrl = s3.createSignedUrl(upload);
  return models.Uploads.create({ uploadId: signedUrl.uploadId })
    .then(() => Promise.resolve(signedUrl));
}

function update(uploads) {

}
