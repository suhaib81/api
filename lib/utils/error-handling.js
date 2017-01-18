'use strict';

const log = require('./logger');

module.exports = {
  catchAndRespond(req, res) {
    return function(error) {
      if (!error.status || !(error.status >= 400 && error.status < 500)) {
        log.error(error);
        return res.status(error.status || 500).json({ message: 'server error', error: error });
      }
      return res.status(error.status).json({ message: error.message || 'Bad request' });
    }
  },
  rejectWithStatus(status, message) {
    let error = new Error(message || 'something went wrong');
    error.status = status || 500;
    return Promise.reject(error);
  }
}
