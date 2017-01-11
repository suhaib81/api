'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const utilsEndPoint = require('../utils/utils-endpoint');
const models = require('../models');
const questionService = require('../services/questions');
const questionRouter = require('express').Router();
const postService = require('../services/posts');
const authGuard = require('../middlewares/auth-guard');

const rejectWithStatus = errorHandling.rejectWithStatus;

questionRouter.route('', authGuard('user'))

.get(authGuard('user'), (req, res) => {
  return questionService.list({
      user: {
        userId: req.userId,
        type: req.userType
      }
    })
    .then(result => responseHandling.success(res, result))
    .catch(errorHandling.catchAndRespond(req, res));
})

.post(authGuard('user'), (req, res) => {
  validateRequest(req, {
      'question.title': { in : 'body', notEmpty: true },
      'question.content': { in : 'body', notEmpty: true }
    })
    .then(() => questionService.create({
      user: { userId: req.userId, type: req.userType },
      title: req.body.question.title,
      content: req.body.question.content
    }))
    .then(question => responseHandling.success(res, question))
    .catch(errorHandling.catchAndRespond(req, res));
})

.patch(authGuard('user'), (req, res) => {
  return questionService.pickup({
      user: {
        userId: req.userId,
        type: req.userType
      }
    })
    .then(result => responseHandling.success(res, result))
    .catch(errorHandling.catchAndRespond(req, res));
})

questionRouter.route('/:questionId', authGuard('user'))

.get(authGuard('user'), (req, res) => {
  utilsEndPoint.withAccessToQuestion({
      user: { userId: req.userId, type: req.userType },
      questionId: req.params.questionId
    })
    .then(() => questionService.listQuestionUsers({ questionId: req.params.questionId })
      .then(result => responseHandling.success(res, result))
      .catch(errorHandling.catchAndRespond(req, res))
    )
    .catch(error => errorHandling.catchAndRespond(req, error))
})

.post(authGuard('user'), (req, res) => {
  validateRequest(req, {
      'question.userId': { in : 'body', notEmpty: true }
    }).then(() => questionService.canJoin({
      userId: req.userId,
      joinUserId: req.body.question.userId,
      questionId: req.params.questionId
    }).then(() => questionService.join({
      userId: req.body.question.userId,
      questionId: req.params.questionId,
      role: 'translator'
    })))
    .then(result => responseHandling.success(res, result))
    .catch(errorHandling.catchAndRespond(req, res))
})

.patch(authGuard('user'), (req, res) => {
  utilsEndPoint.withAccessToQuestion({
      user: { userId: req.userId, type: req.userType },
      questionId: req.params.questionId
    })
    .then(() => questionService.updateQuestion({
      user: { userId: req.userId, type: req.userType },
      questionId: req.params.questionId,
      title: req.body.question.title,
    content: req.body.question.content,
      archived: req.body.question.archived
    }))
    .then(result => responseHandling.success(res, result))
    .catch(errorHandling.catchAndRespond(req, res))
})

.delete(authGuard('user'), (req, res) => {
  utilsEndPoint.withAccessToQuestion({
      user: { userId: req.userId, type: req.userType },
      questionId: req.params.questionId
    })
    .then(() => questionService.returnQuestionBack({
      user: { userId: req.userId, type: req.userType },
      questionId: req.params.questionId
    }))
    .then(result => responseHandling.success(res, result))
    .catch(errorHandling.catchAndRespond(req, res))
});


questionRouter.use('/:questionId/posts', require('./posts'))

module.exports = questionRouter;
