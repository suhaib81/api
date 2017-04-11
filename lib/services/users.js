'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const s3 = require('../utils/s3');

const service = module.exports = {
  getById,
  getByEmail,
  patch,
  listAdmins,
  listTranslators
};

const unpatchableFields = ['userId', 'email'];
const publicFields = ['userId', 'firstName', 'lastName', 'email', 'type', 'language'];

function getById(userId) {
  return models.Users.findOne({
      where: { userId },
      attributes: publicFields,
      include: [{
        model: models.Uploads,
        as: 'uploads',
        attributes: ['uploadId', 'type', 'name', 'createdAt', 'updatedAt', [models.sequelize.fn('concat', s3.bucketAddress, models.sequelize.col('uploads.uploadId')), 'url']]
      }]
    })
    .then(user => user.get({ plain: true }));
}

function getByEmail(email) {
  return models.Users.findOne({
      where: { email },
      attributes: publicFields,
      include: [{
        model: models.Uploads,
        as: 'uploads',
        attributes: ['uploadId', 'type', 'name', 'createdAt', 'updatedAt', [models.sequelize.fn('concat', s3.bucketAddress, models.sequelize.col('uploads.uploadId')), 'url']]
      }]
    })
    .then(user => user.get({ plain: true }));
}

function patch(userId, params) {
  unpatchableFields.forEach(field => delete params[field]);
  return models.Users.update(params, { where: { userId } });
}

function listAdmins(params) {
  return models.Users.findAll({
    where: { 'type': 'admin' },
    attributes: publicFields
  });
}

function listTranslators(params) {
  return models.Users.findAll({
    where: { 'type': 'translator' },
    attributes: publicFields
  });
}
