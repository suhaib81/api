'use strict';

const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const mail = require('../utils/mail');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.send('something');
  });

  app.use('/v1/questions', require('./questions'));
  app.use('/v1/auth', require('./auth'));
  app.use('/v1/mail', require('./mail'));
  app.use('/v1/users', require('./users'));
  app.use('/v1/fileupload', require('./file-upload'));
};
