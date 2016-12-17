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
                userId: params.user.userId
            }, {transaction: t}).then(function (question) {
                return service.join({
                    questionId: question.questionId,
                    userId: params.user.userId,
                    role: 'creator'
                }, {transaction: t}).then(function (questionMember) {
                    return question;
                });
            });
        });
    },
    list: function (params) {
        return models.Questions.findAll({
            include: [{model: models.QuestionsMembers, where: {userId: params.user.userId}, required: true}]
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
        return models.QuestionsMembers.findOne({
            where: {
                userId: params.user.userId,
                questionId: params.questionId,
            }
        });
    },
    join: function (params, options) {
        return models.QuestionsMembers.findOne({
            where: {
                userId: params.userId,
                questionId: params.questionId,
            }
        }).then(function (questionMember) {
            if (questionMember) {
                return new Promise(function (resolve, reject) {
                    resolve(questionMember);
                });
            } else {
                return models.QuestionsMembers.create({
                    userId: params.userId,
                    questionId: params.questionId,
                    role: params.role
                }, options);
            }
        });
    }
}