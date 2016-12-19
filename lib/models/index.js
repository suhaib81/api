'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const log = require('../utils/logger');

var db = {};
var config = require(__dirname + '/../../database/config/config.json')[env];

config.logging = log.db;

if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
    /*
     if (db[modelName].associate) {
     db[modelName].associate(db);
     }
     */
});

sequelize
    .authenticate()
    .then(function (err) {
        log.trace('Connection has been established successfully.');
    })
    .catch(function (err) {
        log.trace(`Unable to connect to the database: ${err}`);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
