'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const postRouter = require('express').Router({mergeParams: true});
const postService = require('../services/posts');
const questionsService = require('../services/questions');
const authGuard = require('../middlewares/auth-guard');
const utilsEndPoint = require('../utils/utils-endpoint');
const mail = require('../utils/mail');


postRouter.route('', authGuard('user'))
  .get(authGuard('user'), (req, res) => {
    utilsEndPoint.withAccessToQuestion({
        user: {userId: req.userId, type: req.userType},
        questionId: req.params.questionId
      })
      .then(() =>
        postService.listPosts({questionId: req.params.questionId})
          .then(result => responseHandling.success(res, result))
          .catch(errorHandling.catchAndRespond(req, res))
      )
      .catch(errorHandling.catchAndRespond(req, res))
  })

  .post(authGuard('user'), (req, res) => {
    validateRequest(req, {
      'post.message': {in: 'body', notEmpty: true}
    })
      .then(() => utilsEndPoint.withAccessToQuestion({
        user: {userId: req.userId, type: req.userType},
        questionId: req.params.questionId
      }))
      .then(() => postService.createPost({
        user: {userId: req.userId, type: req.userType},
        questionId: req.params.questionId,
        message: req.body.post.message,
        type: 'message'
      }))
      .then(post => {
        if (post.rows > 0) {
          responseHandling.success(res, post)
        } else {
          return questionsService.listQuestionUsers({questionId: req.params.questionId})
            .then(users => {
              //send an email to the user only if the difference x time between Latest message date and the current one
              users.forEach(function (item) {
                //email will not be sent to the message creator only for other users who's part of the question
                if (req.userId != item.userId) {
                  mail('new-message', {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    language: item.language
                  })
                }
              });
            }).then(()=>responseHandling.success(res, post))
        }
      })
      .catch(errorHandling.catchAndRespond(req, res))

  })


postRouter.route('/:postId', authGuard('user'))

  .patch((req, res) => {
    postService.editPost({
        message: req.body.post.message,
        postId: req.params.postId
      })
      .then(result => responseHandling.success(res, result))
      .catch(errorHandling.catchAndRespond(req, res))
  })

  .delete((req, res) => {
    postService.deletePost({postId: req.params.postId})
      .then(result => responseHandling.success(res, result))
      .catch(errorHandling.catchAndRespond(req, res))
  });

module.exports = postRouter;
