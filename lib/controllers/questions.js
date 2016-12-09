'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const questionRouter = require('express').Router();
const authGuard = require('../middlewares/auth-guard');

questionRouter.route('', authGuard('user'))
  .get(authGuard('user'), (req, res) => {
    res.send({ question: 'HELLO' });
  })
  .post((req, res) => {
    let question = req.body.question;
    question.question_id = 5;
    res.status(201).send({ question: question });
  });

questionRouter.route('/:questionId', authGuard('user'))
  .patch((req, res) => {
    res.status(204).send({ message: 'ok' });
  })
  .delete((req, res) => {
    res.status(204).send({ message: 'ok' });
  });

module.exports = questionRouter;
