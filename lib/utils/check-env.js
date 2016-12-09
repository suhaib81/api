'use strict';

const log = require('./logger');

if (!process.env.JWT_SECRET) {
  log.error('!!WARNING: No JWT_SECRET given in environment variable. No authentication will possible!!');
  process.exit();
}

module.exports = {
  check() {
    var valid = true;

    if (!process.env.JWT_SECRET) {
      log.error('!!WARNING: No JWT_SECRET given in environment variable. No authentication will possible!!');
      valid = false;
    }

    if (!valid) {
      log.error('Exiting: Critical env variable missing');
      process.exit();
    }
  }
}
