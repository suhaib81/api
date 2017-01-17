'use strict';

const log = require('./logger');

module.exports = {
  check() {
    var valid = true;

    if (!process.env.NODE_ENV) {
      log.error('WARNING: Missing environment variables.');
      valid = false;
    }

    if (!process.env.JWT_SECRET) {
      log.error('WARNING: No JWT_SECRET given in environment variable. No authentication will possible.');
      valid = false;
    }
    
    if (!valid) {
      log.error('Exiting: Critical env variable missing');
      process.exit();
    }
  }
}
