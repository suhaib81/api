'use strict';

const Promise = require('bluebird');
const models = require('../models');

const service = module.exports = {
  getById,
  getByEmail
};

function getById(userId) {
  return models.Users.findOne({
      where: { userId },
      attributes: ['userId', 'email', 'password', 'active']
    })
    .then(user => user.get({ plain: true }));
}

function getByEmail(email) {
  return models.Users.findOne({
      where: { email },
      attributes: ['userId', 'email', 'password', 'active']
    })
    .then(user => user.get({ plain: true }));
}
