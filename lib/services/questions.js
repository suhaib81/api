'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const s3 = require('../utils/s3');

var service = module.exports = {
  create,
  list,
  canJoin,
  join,
  volunteerPickup,
  volunteerLeave,
  listQuestionUsers,
  editQuestion,
  getQuestionUser
}

function create(params) {
  return models.sequelize.transaction(transaction => {
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
      .then(() => addUploads({
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
}

function addUploads(params, options) {
  return Promise.all(params.uploadIds.map(uploadId => models.QuestionsUploads.create({
    questionId: params.questionId,
    uploadId: uploadId
  }, options)));
}

function patchUploads(params, options) {
  let uploadsInDb;
  let uploadsInParams;
  let uploadsToAdd;
  let uploadsToRemove;

  if (params.uploads && Array.isArray(params.uploads) && typeof params.uploads[0] !== 'string') {
    params.uploads = params.uploads.map(el => el.uploadId);
  }

  return models.QuestionsUploads.findAll({
      where: { questionId: params.questionId }
    })
    .then(questionsUploads => {
      uploadsInDb = questionsUploads.map(el => el.uploadId);
      uploadsInParams = params.uploads;
      uploadsToAdd = uploadsInParams.filter(el => uploadsInDb.indexOf(el) === -1);
      uploadsToRemove = uploadsInDb.filter(el => uploadsInParams.indexOf(el) === -1);
      return Promise.resolve();
    })
    .then(() => {
      if (!uploadsToRemove || uploadsToRemove.length === 0) {
        return Promise.resolve();
      } else {
        return models.QuestionsUploads.destroy({
          where: { uploadId: uploadsToRemove }
        });
      }
    })
    .then(() => {
      if (!uploadsToAdd || uploadsToAdd.length === 0) {
        return Promise.resolve();
      } else {
        return addUploads({
          questionId: params.questionId,
          uploadIds: uploadsToAdd
        });
      }
    });
}

function list(params) {
  return models.Questions.findAll({
      attributes: ['questionId'],
      include: [{
        model: models.Users,
        as: 'Users',
        where: { userId: params.user.userId },
        required: true,
        attributes: ['userId']
      }]
    })
    .then(response => {
      let questionIds;
      if (response === null) {
        return Promise.resolve(null);
      } else {
        questionIds = response.map(instance => instance.questionId);
        return models.Questions.findAll({
          where: { questionId: questionIds },
          include: [{
            model: models.Users,
            as: 'Users',
            attributes: ['userId', 'firstName', 'lastName', 'email', 'type'],
            include: [{
              model: models.Uploads,
              as: 'uploads',
              attributes: ['uploadId', 'type', 'name', 'createdAt', 'updatedAt', [models.sequelize.fn('concat', s3.bucketAddress, models.sequelize.col('Users.uploads.uploadId')), 'url']]
            }],
          }, {
            model: models.Uploads,
            as: 'uploads',
            attributes: ['uploadId', 'type', 'name', 'createdAt', 'updatedAt', [models.sequelize.fn('concat', s3.bucketAddress, models.sequelize.col('uploads.uploadId')), 'url']]
          }, {
            model: models.Posts,
            include: [{
              model: models.Users,
              as: 'Users',
              attributes: ['userId', 'firstName', 'lastName', 'type']
            }]
          }]
        });
      }
    });
}

function getQuestionUser(params) {
  return models.QuestionsUsers.findOne({
    where: {
      userId: params.user.userId,
      questionId: params.questionId
    }
  });
}

function canJoin(params) {
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
}

function join(params, options) {
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
}

function volunteerPickup(params) {
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
}

function volunteerLeave(params) {
  return models.QuestionsUsers.destroy({
      where: { role: ['volunteer', 'translator'], questionId: params.questionId }
    })
    .then(function() {
      return models.Questions.update({ status: 'open' }, { where: { questionId: params.questionId } });
    });
}

function listQuestionUsers(params) {
  return models.Users.findAll({
    include: [{ model: models.QuestionsUsers, where: { questionId: params.questionId }, required: true }],
    raw: true,
    attributes: ['userId', 'firstName', 'lastName', 'email', 'type', 'language']
  });
}

function editQuestion(params) {
  return models.Questions.update({
      title: params.title,
      content: params.content,
      status: params.status
    }, {
      where: { questionId: params.questionId }
    })
    .then(() => patchUploads(params));
}
