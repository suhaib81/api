'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const models = require('../models');
const questionService = require('../services/questions');
const questionRouter = require('express').Router();
const authGuard = require('../middlewares/auth-guard');

const rejectWithStatus = errorHandling.rejectWithStatus;

function sanitizeUsers (users) {
    return users.map(function (user) {
        var attributes = {
            id: user.id,
            name: user.name,
            email: user.email,
            fbPicture: user.fbPicture,
            type: user.type
        };

        if (user['QuestionMembers.role']) {
            attributes['role'] = user['QuestionMembers.role'];
            attributes['lastViewedAt'] = user['QuestionMembers.lastViewedAt'];
            attributes['lastPostCount'] = user['QuestionMembers.lastPostCount'];
            attributes['createdAt'] = user['QuestionMembers.createdAt'];
        }

        return attributes;
    });
};
function withAccessToQuestion (params) {
    return questionService.getQuestionUser(params).then(function (questionMember) {
        return questionMember ? Promise.resolve() : Promise.reject(new Error('Current user is not part of the question'));
    });
};

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

    /*/questions/pick_up PATCH: pick up an open question and add it to question members with user id*/

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
        withAccessToQuestion({user: {userId: req.userId, type: req.userType}, questionId: req.params.questionId})
            .then(() => questionService.listQuestionUsers({questionId: req.params.questionId})
                .then(result => responseHandling.success(res, result))
                .catch(errorHandling.catchAndRespond(req, res))
            )
            .catch(error => errorHandling.catchAndRespond(req, error))
    })

    .patch((req, res) => {
        res.status(204).send({message: 'ok'});
    })
    .delete((req, res) => {
        res.status(204).send({message: 'ok'});
    });


/*
 * *
 * /users/invite GET list all volunteers for invite a translator function to question members with user id
 * /questions/join POST join a question with question members with user id
 * /questions/:Qid/free POST give a question back mark question status open and delete the user volunteer type from                                     question members table
 * /questions/:Qid/leave mark the question as status solved (archive)
 * /questions/:Qid/users GET returns all the users who are in this members question
 * /questions/:Qid/posts POST Create a new Message (post) for the question id Qid
 * /questions/:Qid/upload POST api that will upload the file
 * /questions/:Qid/file/:uuid/:filename Download the file from chat history (posts list)
 * /questions/:Qid/posts GET returns all chat history (posts list) for question id and user id should be withAccessToQuestion
 *
 * shall i add admin routes here or we need separate backend api
 * /questions/all GET
 * /questions/history GET
 * */


module.exports = questionRouter;
