'use strict';

const log = require('./logger');

module.exports = {
  success(res, result) {
    return res.json({ data: result });
  }
}
