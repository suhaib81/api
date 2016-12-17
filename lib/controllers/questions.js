'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const questionService = require('../services/questions');
const questionRouter = require('express').Router();
const authGuard = require('../middlewares/auth-guard');

var successHandler = function (res, result) {
    res.json({success: true, data: result});
};
var errorHandler = function (res, error) {
    return res.status(400).json({success: false, error: "Something went wrong"});
};
var sanitizeUsers = function (users) {
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
var withAccessToQuestion = function (user, questionId) {
    return questionService.getQuestionUser({
        questionId: questionId,
        user: user
    }).then(function (questionMember) {
        return questionMember ? Promise.resolve() : Promise.reject(new Error('Current user is not part of the question'));
    });
};


questionRouter.route('', authGuard('user'))
    .get(authGuard('user'), (req, res) => {
        return questionService.list({user: {userId: req.userId, type: req.userType}}).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    })
    .post((req, res) => {
        return questionService.create({
            user: {userId: req.userId, type: req.userType},
            title: req.body.question.title
        }).then(function (question) {
            return successHandler(res, question);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

questionRouter.route('/:questionId', authGuard('user'))
    .patch((req, res) => {
        res.status(204).send({message: 'ok'});
    })
    .delete((req, res) => {
        res.status(204).send({message: 'ok'});
    });


/*
 * /questions GET return all questions list for the user
 * /questions POST Create a new question
 * /questions/pick_up POST: pick up an open question and add it to question members with user id
 * /users GET helper route list all users using sanitizeUsers function
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
