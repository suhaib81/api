const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const questionRouter = require('express').Router();
const authGuard = require('../middlewares/auth-guard');


var service = module.exports = {
    create: function (params) {
        return models.sequelize.transaction(function (t) {
            return models.Questions.create({
                title: params.title,
                status: 'open',
                creatorId: params.user.userId
            }, {transaction: t}).then(function (question) {
                return service.join({
                    questionId: question.questionId,
                    userId: params.user.userId,
                    role: 'creator'
                }, {transaction: t}).then(function (questionsUsers) {
                    return question;
                });
            });
        });
    },
    list: function (params) {
        return models.Questions.findAll({
            include: [{model: models.QuestionsUsers, where: {userId: params.user.userId}, required: true}]
        });
    },
    listAll: function (params) {
        return models.Questions.findAll({
            attributes: ['questionId', 'title', 'status', 'updatedAt', 'creatorId'],
            order: '"question"."createdAt" ASC',
            include: [{model: models.Users}]
        });
    },
    getQuestionUser: function (params) {
        return models.QuestionsUsers.findOne({
            where: {
                userId: params.user.userId,
                questionId: params.questionId,
            }
        });
    },
    join: function (params, options) {
        return models.QuestionsUsers.findOne({
            where: {
                userId: params.userId,
                questionId: params.questionId,
            }
        }).then(function (questionsUsers) {
            if (questionsUsers) {
                return new Promise(function (resolve, reject) {
                    resolve(questionsUsers);
                });
            } else {
                return models.QuestionsUsers.create({
                    userId: params.userId,
                    questionId: params.questionId,
                    role: params.role
                }, options);
            }
        });
    }
}