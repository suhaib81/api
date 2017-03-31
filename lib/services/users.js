'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');

var service = module.exports = {
  listAdmins,
  listTranslators
}

function listAdmins (params) {
  return models.Users.findAll({
    where: {'type': 'admin'},
    attributes: ['userId', 'firstName', 'lastName', 'email', 'type','language']
  });
}

function listTranslators (params) {
  return models.Users.findAll({
    where: {'type': 'translator'},
    attributes: ['userId', 'firstName', 'lastName', 'email', 'type','language']
  });
}
