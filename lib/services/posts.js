'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const responseHandling = require('../utils/response-handler');
const validateRequest = require('../utils/validate-request');
const uitlsEndPoint = require('../utils/utils-endpoint');
const models = require('../models');
const postService = require('../services/posts');
const rejectWithStatus = errorHandling.rejectWithStatus;


var service = module.exports = {
  listPosts: function(params) {
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
  },
  createPost: function(params) {
    return models.Posts.create({
      type: params.type,
      message: params.message,
      userId: params.user.userId,
      questionId: params.questionId
    });
  },
  deletePost: function(params) {
    return models.Posts.destroy({
      where: { postId: params.postId },
      force: true
    });
  },
  editPost: function(params) {
    return models.Posts.update({
      message: params.message
    }, { where: { postId: params.postId } });
  }
}
