'use strict';

if (!process.env.NODE_ENV) { require('dotenv').config(); }
require('./lib/utils/check-env').check();

const DEFAULT_PORT = 4050;
const log = require('./lib/utils/logger');

const app = require('express')();
require('./lib/middlewares')(app);
require('./lib/controllers')(app);

try {
  const server = require('http').createServer(app);
  const io = require('./lib/utils/web-sockets').registerServer(server);
  server.listen(process.env.PORT || DEFAULT_PORT);
  log.info(`Open Embassy API booted`);
  log.info(`Environment          : ${process.env.NODE_ENV}`);
  log.info(`Port                 : ${server.address().port}`);
} catch (error) {
  log.error(`Error starting API`);
  log.error(error);
}

module.exports = app;
