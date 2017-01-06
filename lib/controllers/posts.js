'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const uitlsEndPoint = require('../utils/utils-endpoint');
const postService = require('../services/posts');
const postRouter = require('express').Router();
const authGuard = require('../middlewares/auth-guard');


postRouter.route('', authGuard('user'))
    .get(authGuard('user'), (req, res) => {
        res.send({post: 'HELLO i\'m a post'});
    });

postRouter.route('/:questionId', authGuard('user'))

    .get(authGuard('user'), (req, res)=> {

        uitlsEndPoint.withAccessToQuestion({
            user: {userId: req.userId, type: req.userType},
            questionId: req.params.questionId
        }).then(() =>
                postService.listPosts({questionId: req.params.questionId})
                    .then(result => responseHandling.success(res, result))
                    .catch(errorHandling.catchAndRespond(req, res))
            )
            .catch(errorHandling.catchAndRespond(req, res))
    })

    .post(authGuard('user'), (req, res) => {
        validateRequest(req, {
            'post.message': {in: 'body', notEmpty: true}
        }).then(() => uitlsEndPoint.withAccessToQuestion({
                user: {userId: req.userId, type: req.userType},
                questionId: req.params.questionId
            }).then(()=> postService.createPost({
                user: {userId: req.userId, type: req.userType},
                questionId: req.params.questionId,
                message: req.body.post.message,
                type: 'message'
            })))
            .then(post => responseHandling.success(res, post))
            .catch(errorHandling.catchAndRespond(req, res))
    })

    .patch((req, res) => {
        res.status(204).send({message: 'ok'});
    })
    .delete((req, res) => {
        res.status(204).send({message: 'ok'});
    });

module.exports = postRouter;
