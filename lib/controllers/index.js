'use strict';

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.send('something');
  });

  app.use('/v1/questions', require('./questions'));
  app.use('/v1/posts', require('./posts'));
  app.use('/v1/auth', require('./auth'));
};
