'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const s3 = require('../utils/s3');

var service = module.exports = {
  create: function(params) {
    return models.sequelize.transaction(transaction => {
      console.log('UPLOADS');
      console.log(params.uploads);
      let question;

      return models.Questions.create({
          title: params.title,
          content: params.content,
          status: 'open',
          userId: params.user.userId,
          uploads: [params.uploads]
        }, {
          transaction: transaction
        })
        .then(result => {
          question = result;
          return service.join({
            questionId: question.questionId,
            userId: params.user.userId,
            role: 'creator'
          }, {
            transaction: transaction
          });
        })
        .then(() => service.addUploads({
          questionId: question.questionId,
          uploadIds: params.uploads
        }, {
          transaction: transaction
        }))
        .then(result => {
          question.uploads = result.map(resultItem => resultItem.dataValues.uploadId);
          return question;
        });

    });
  },
  addUploads: function(params, options) {
    return Promise.all(params.uploadIds.map(uploadId => models.QuestionsUploads.create({
      questionId: params.questionId,
      uploadId: uploadId
    }, options)));
  },
  list: function(params) {
    return models.Questions.findAll({
        include: [{
          model: models.QuestionsUsers,
          where: { userId: params.user.userId },
          include: [{
            model: models.Users,
            as: 'Users',
            attributes: ['userId', 'firstName', 'lastName', 'email', 'type']
          }],
          required: true
        }, {
          model: models.Uploads,
          as: 'uploads',
          attributes: ['uploadId', 'createdAt', 'updatedAt', [models.sequelize.fn('concat', s3.bucketAddress, models.sequelize.col('uploads.uploadId')), 'url']]
        }, {
          model: models.Posts,
          include: [{
            model: models.Users,
            as: 'Users',
            attributes: ['userId', 'firstName', 'lastName', 'type']
          }]
        }]
      });
  },
  getQuestionUser: function(params) {
    return models.QuestionsUsers.findOne({
      where: {
        userId: params.user.userId,
        questionId: params.questionId
      }
    });
  },
  canJoin: function(params) {
    return models.Users.findAll({
      where: {
        userId: [params.userId, params.joinUserId]
      },
      attributes: ['userId', 'firstName', 'lastName', 'email', 'type']
    }).then(function(users) {
      var creator = users.find(function(user) {
        return user.userId == params.userId
      });
      var joinee = users.find(function(user) {
        return user.userId == params.joinUserId
      });
      if (!creator || !joinee || creator.type == 'user' || joinee.type == 'user') {
        var error = new Error('Users to join should be non regular users');
        error.status = 403;
        return Promise.reject(error);
      }

      return models.QuestionsUsers.findAll({
        where: {
          questionId: params.questionId
        }
      }).then(function(questionsUsers) {
        if (questionsUsers.length == 1 && questionsUsers[0].role == 'creator') {
          // The only member is the creator, any volunteer is able to join this question himself
          if (creator.id == joinee.id) {
            Promise.resolve();
          } else {
            var error = new Error('Could not join question');
            error.status = 403;
            Promise.reject(error);
          }
        } else if (questionsUsers.length) {
          // There are members and the userId is part of the members
          var creatorInMembers = questionsUsers.find(function(qm) {
            return qm.userId == params.userId
          });
          if (creatorInMembers) {
            return Promise.resolve();
          } else {
            var error = new Error('Cannot add users to a question you\'re not part of');
            error.status = 403;
            return Promise.reject(error);
          }
        } else {
          var error = new Error('Could not join question');
          error.status = 403;
          return Promise.reject(error);
        }
      });
    });
  },
  join: function(params, options) {
    return models.QuestionsUsers.findOne({
      where: {
        userId: params.userId,
        questionId: params.questionId
      }
    }).then(function(questionsUsers) {
      if (questionsUsers) {
        return new Promise(function(resolve, reject) {
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
  volunteerPickup: function(params) {
    return models.Questions.findOne({
        where: { status: 'open' },
        order: '"Questions"."createdAt" ASC'
      })
      .then(function(question) {
        if (question) {
          return service.canJoin({
            userId: params.user.userId,
            joinUserId: params.user.userId,
            questionId: question.questionId
          }).then(function() {
            return models.sequelize.transaction(function(t) {
              return question.update({ status: 'picked-up' }, { transaction: t }).then(function(result) {
                return service.join({
                  userId: params.user.userId,
                  questionId: question.questionId,
                  role: 'volunteer'
                }, { transaction: t });
              });
            });
          });
        } else {
          return Promise.resolve(false);
        }
      });
  },
  volunteerLeave: function(params) {
    return models.QuestionsUsers.destroy({
        where: { role: ['volunteer', 'translator'], questionId: params.questionId }
      })
      .then(function() {
        return models.Questions.update({ status: 'open' }, { where: { questionId: params.questionId } });
      });
  },
  listQuestionUsers: function(params) {
    return models.Users.findAll({
      include: [{ model: models.QuestionsUsers, where: { questionId: params.questionId }, required: true }],
      raw: true,
      attributes: ['userId', 'firstName', 'lastName', 'email', 'type']
    });
  },
  editQuestion: function(params) {
    return models.Questions.update({
      title: params.title,
      content: params.content,
      status: params.status
    }, { where: { questionId: params.questionId } });
  }
}
