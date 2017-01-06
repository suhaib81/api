'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const uitlsEndPoint = require('../utils/utils-endpoint');
const models = require('../models');
const questionService = require('../services/questions');
const questionRouter = require('express').Router();
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
            'question.title': {in: 'body', notEmpty: true}
        }).then(() => questionService.create({
                user: {userId: req.userId, type: req.userType},
                title: req.body.question.title
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
        uitlsEndPoint.withAccessToQuestion({
                user: {userId: req.userId, type: req.userType},
                questionId: req.params.questionId
            })
            .then(() => questionService.listQuestionUsers({questionId: req.params.questionId})
                .then(result => responseHandling.success(res, result))
                .catch(errorHandling.catchAndRespond(req, res))
            )
            .catch(error => errorHandling.catchAndRespond(req, error))
    })

    .post(authGuard('user'), (req, res) => {
        validateRequest(req, {
            'question.userId': {in: 'body', notEmpty: true}
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
        uitlsEndPoint.withAccessToQuestion({
            user: {userId: req.userId, type: req.userType},
            questionId: req.params.questionId
        }).then(() => questionService.archiveQuestion({
                user: {userId: req.userId, type: req.userType},
                questionId: req.params.questionId
            })
            .then(result => responseHandling.success(res, result))
            .catch(errorHandling.catchAndRespond(req, res))
        ).catch(errorHandling.catchAndRespond(req, res))
    })

    .delete(authGuard('user'), (req, res) => {
        uitlsEndPoint.withAccessToQuestion({
            user: {userId: req.userId, type: req.userType},
            questionId: req.params.questionId
        }).then(() => questionService.returnQuestionBack({
                user: {userId: req.userId, type: req.userType},
                questionId: req.params.questionId
            })
            .then(result => responseHandling.success(res, result))
            .catch(errorHandling.catchAndRespond(req, res))
        ).catch(errorHandling.catchAndRespond(req, res))

    });


/*
 * *
 * /users/invite GET list all volunteers for invite a translator function to question members with user id
 * /questions/join POST join a question with question members with user id
 * /questions/:Qid/free POST give a question back mark question status open and delete the user volunteer type from                                     question members table
 * /questions/:Qid/leave mark the question as status solved (archive)
 * /questions/:Qid/users GET returns all the users who are in this members question
 * /questions/:Qid/upload POST api that will upload the file
 * /questions/:Qid/file/:uuid/:filename Download the file from chat history (posts list)
 * shall i add admin routes here or we need separate backend api
 * /questions/all GET
 * /questions/history GET
 * */


module.exports = questionRouter;
