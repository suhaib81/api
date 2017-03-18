'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const utilsEndPoint = require('../utils/utils-endpoint');
const questionsService = require('../services/questions');
const questionRouter = require('express').Router();
const postService = require('../services/posts');
const authGuard = require('../middlewares/auth-guard');

const rejectWithStatus = errorHandling.rejectWithStatus;

questionRouter.route('')
  .get(authGuard('user'), (req, res) => {
    return questionsService.list({
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
      .then(() => questionsService.create({
        user: { userId: req.userId, type: req.userType },
        title: req.body.question.title,
        content: req.body.question.content,
        uploads: req.body.question.uploads || []
      }))
      .then(question => responseHandling.success(res, question))
      .catch(errorHandling.catchAndRespond(req, res));
  });

questionRouter.route('/:questionId')
  .get(authGuard('user'), (req, res) => {
    utilsEndPoint.withAccessToQuestion({
        user: { userId: req.userId, type: req.userType },
        questionId: req.params.questionId
      })
      .then(() => questionsService.listQuestionUsers({ questionId: req.params.questionId })
        .then(result => responseHandling.success(res, result))
        .catch(errorHandling.catchAndRespond(req, res))
      )
      .catch(error => errorHandling.catchAndRespond(req, error))
  })
  .post(authGuard('user'), (req, res) => {
    validateRequest(req, {
        'question.userId': { in : 'body', notEmpty: true }
      })
      .then(() => questionsService.canJoin({
        userId: req.userId,
        joinUserId: req.body.question.userId,
        questionId: req.params.questionId
      }).then(() => questionsService.join({
        userId: req.body.question.userId,
        questionId: req.params.questionId,
        role: 'translator'
      })))
      .then(result => responseHandling.success(res, result))
      .catch(errorHandling.catchAndRespond(req, res))
  })
  .patch(authGuard('user'), (req, res) => {
    validateRequest(req, {
        'question.title': { in : 'body', notEmpty: true },
        'question.content': { in : 'body', notEmpty: true },
        'question.status': { in : 'body', notEmpty: true },
        'question.uploads': { in : 'body', notEmpty: true }
      })
      .then(() => utilsEndPoint.withAccessToQuestion({
        user: { userId: req.userId, type: req.userType },
        questionId: req.params.questionId
      }))
      .then(() => questionsService.editQuestion({
        user: { userId: req.userId, type: req.userType },
        questionId: req.params.questionId,
        title: req.body.question.title,
        content: req.body.question.content,
        status: req.body.question.status,
        uploads: req.body.question.uploads
      }))
      .then(result => responseHandling.success(res, result))
      .catch(errorHandling.catchAndRespond(req, res))
  });


questionRouter.use('/:questionId/posts', require('./posts'))

module.exports = questionRouter;
