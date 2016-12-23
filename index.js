'use strict';

if (!process.env.NODE_ENV) {
    require('dotenv').load();
    require('./lib/utils/check-env').check();
}

const DEFAULT_PORT = 4050;
const log = require('./lib/utils/logger');
const models = require('./lib/models');

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

 /*   models.sequelize.query('CREATE EXTENSION IF NOT EXISTS hstore').then(function () {
        models.sequelize.sync().then(function () {
            console.log('Database ready!');
        });
    });*/

} catch (error) {
    log.error(`Error starting API`);
    log.error(error);
}

module.exports = app;
