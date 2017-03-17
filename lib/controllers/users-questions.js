'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const usersQuestionsRouter = require('express').Router({ mergeParams: true });
const authGuard = require('../middlewares/auth-guard');
const questionsService = require('../services/questions');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const utilsEndpoint = require('../utils/utils-endpoint');

usersQuestionsRouter.route('')
  .get(authGuard('user'), (req, res) => {})
  .post(authGuard('user'), (req, res) => {
    questionsService.volunteerPickup({
        user: { userId: req.userId, type: req.userType }
      })
      .then(result => {
        if (result === false) {
          return res.status(404).json({ data: null, reason: 'no open questions' })
        } else {
          return responseHandling.success(res, result);
        }
      })
      .catch(errorHandling.catchAndRespond(req, res))
  });


usersQuestionsRouter.route('/:questionId')
  .patch(authGuard('user'), (req, res) => {
    res.status(200).json({ message: 'ok' });
  })
  .delete(authGuard('user'), (req, res) => {
    utilsEndpoint.withAccessToQuestion({
        user: { userId: req.userId, type: req.userType },
        questionId: req.params.questionId
      })
      .then(() => questionsService.volunteerLeave({
        user: { userId: req.userId, type: req.userType },
        questionId: req.params.questionId
      }))
      .then(result => res.status(204).send())
      .catch(errorHandling.catchAndRespond(req, res))
  });

module.exports = usersQuestionsRouter;
