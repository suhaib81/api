'use strict';

const log = require('./logger');
const Promise = require('bluebird');
const questionService = require('../services/questions');


module.exports = {
  withAccessToQuestion(params) {
    return questionService.getQuestionUser(params).then(function(questionsUsers) {
      return questionsUsers ? Promise.resolve() : Promise.reject(new Error('Current user is not part of the question'));
    });
  }
}
