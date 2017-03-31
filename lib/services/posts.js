'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');

var service = module.exports = {
  listPosts,
  createPost,
  deletePost,
  editPost
}

function listPosts (params) {
  return models.Posts.findAll({
    include: [{
      model: models.Users,
      as: 'Users',
      attributes: ['userId', 'firstName', 'lastName', 'email', 'type']
    }],
    where: {
      questionId: params.questionId
    },
    order: '"Posts"."createdAt" ASC'
  });
}

function createPost (params) {

  return models.sequelize.query('SELECT "createdAt" FROM "Posts" WHERE "questionId" = :questionId AND age(now(),"createdAt") <' + "'30 minutes'", {replacements: {questionId: params.questionId}})
    .then(rows => {
      return models.Posts.create({
        type: params.type,
        message: params.message,
        userId: params.user.userId,
        questionId: params.questionId
      }).then(Posts => {return {posts: Posts, rows: rows[0].length}})
    })
}

function deletePost (params) {
  return models.Posts.destroy({
    where: {postId: params.postId},
    force: true
  });
}

function editPost (params) {
  return models.Posts.update({
    message: params.message
  }, {where: {postId: params.postId}});
}
