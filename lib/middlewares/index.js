const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('../utils/logger');

module.exports = function(app) {
  app.use(bodyParser.json({
    limit: '3mb'
  }));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(cors());

  app.use(require('morgan')('tiny', {
    'stream': logger.stream
  }));

};
