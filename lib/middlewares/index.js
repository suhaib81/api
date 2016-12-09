const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const log = require('../utils/logger');

module.exports = function(app) {
  app.use(bodyParser.json({
    limit: '3mb'
  }));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(expressValidator())

  app.use(cors());

  app.use(require('morgan')('tiny', {
    'stream': log.stream
  }));
};
