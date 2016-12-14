'use strict';

const Promise = require('bluebird');
const util = require('util');
const errorHandling = require('./error-handling');

module.exports = function(req, validationParams) {
  req.check(validationParams);
  return req.getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        return errorHandling.rejectWithStatus(400, `Invalid input: ${util.inspect(result.mapped())}`);
      }
      return Promise.resolve();
    });
}
