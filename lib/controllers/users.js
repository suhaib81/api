'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const usersRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');

usersRouter.use('/:userId/questions', require('./users-questions'));

module.exports = usersRouter;
