'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const usersRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const models = require('../models');
const log = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const validateRequest = require('../utils/validate-request');
const users = require('../services/users');

usersRouter.route('')
  .get(authGuard('user'), (req, res) => {
    users.getById(req.userId)
      .then(response => {
        res.send(response);
      })
      .catch(errorHandling.catchAndRespond(req, res));
  })
  .patch(authGuard('user'), (req, res) => {
    users.patch(req.userId, req.body)
      .then(response => {
        res.status(204).send();
      })
      .catch(errorHandling.catchAndRespond(req, res));
  })


usersRouter.use('/:userId/questions', require('./users-questions'));



module.exports = usersRouter;
