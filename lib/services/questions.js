const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');

var service = module.exports = {
    create: function (params) {
        return models.sequelize.transaction(function (t) {
            return models.Questions.create({
                title: params.title,
                content: params.content,
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
            include: [{
                model: models.QuestionsUsers,
                where: {userId: params.user.userId},
                include: [{model: models.Users, as: 'Users'}],
                required: true
            }]
        });
    },
    listAll: function (params) {
        return models.Questions.findAll({
            attributes: ['questionId', 'title', 'content','status', 'updatedAt', 'creatorId'],
            order: '"question"."createdAt" ASC',
            include: [{model: models.Users}]
        });
    },
    getQuestionUser: function (params) {
        return models.QuestionsUsers.findOne({
            where: {
                userId: params.user.userId,
                questionId: params.questionId
            }
        });
    },
    canJoin: function (params) {
        return models.Users.findAll({
            where: {
                userId: [params.userId, params.joinUserId]
            },
            attributes: ['userId', 'firstName', 'lastName', 'email', 'type']
        }).then(function (users) {
            var creator = users.find(function (user) {
                return user.userId == params.userId
            });
            var joinee = users.find(function (user) {
                return user.userId == params.joinUserId
            });
            if (!creator || !joinee || creator.type == 'user' || joinee.type == 'user') {
                return Promise.reject(new Error('Users to join should be non regular users'));
            }

            return models.QuestionsUsers.findAll({
                where: {
                    questionId: params.questionId
                }
            }).then(function (questionsUsers) {
                if (questionsUsers.length == 1 && questionsUsers[0].role == 'creator') {
                    // The only member is the creator, any volunteer is able to join this question himself
                    return creator.id == joinee.id ? Promise.resolve() : Promise.reject(new Error('Could not join question'));
                } else if (questionsUsers.length) {
                    // There are members and the userId is part of the members
                    var creatorInMembers = questionsUsers.find(function (qm) {
                        return qm.userId == params.userId
                    });
                    if (creatorInMembers) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject(new Error('Cannot add users to a question you\'re not part of'));
                    }
                } else {
                    return Promise.reject(new Error('Could not join question'));
                }
            });
        });
    },
    join: function (params, options) {
        return models.QuestionsUsers.findOne({
            where: {
                userId: params.userId,
                questionId: params.questionId
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
    },
    pickup: function (params) {
        return models.Questions.findOne({
            where: {
                status: 'open'
            },
            order: '"Questions"."createdAt" ASC'
        }).then(function (question) {
            if (question) {
                return service.canJoin({
                    userId: params.user.userId,
                    joinUserId: params.user.userId,
                    questionId: question.questionId
                }).then(function () {
                    return models.sequelize.transaction(function (t) {
                        return question.update({status: 'picked-up'}, {transaction: t}).then(function (result) {
                            return service.join({
                                userId: params.user.userId,
                                questionId: question.questionId,
                                role: 'volunteer'
                            }, {transaction: t});
                        });
                    });
                });
            } else {
                return Promise.resolve(false);
            }

        })
    },
    listQuestionUsers: function (params) {
        return models.Users.findAll({
            include: [{model: models.QuestionsUsers, where: {questionId: params.questionId}, required: true}],
            raw: true,
            attributes: ['userId', 'firstName', 'lastName', 'email', 'type']
        });
    },
    returnQuestionBack:function (params){
        return models.QuestionsUsers.destroy({
                where: {role: ['volunteer', 'translator'], questionId: params.questionId},
                force: true
            })
            .then(function () {
                return models.Questions.update({status: 'open'}, {where: {questionId: params.questionId}});
            });
    },
    archiveQuestion: function (params) {
        return models.Questions.update({status: 'answered'}, {where: {questionId: params.questionId}});
    }
}