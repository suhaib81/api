'use strict';

const log = require('./logger');
const Promise = require('bluebird');
const questionService = require('../services/questions');


module.exports = {
  withAccessToQuestion(params) {
    return questionService.getQuestionUser(params).then(function(questionsUsers) {
      if(questionsUsers){
        return Promise.resolve()
      }else{
        var error = new Error('Current user is not part of the question');
        error.status = 403;
       return Promise.reject(error);
      }
    });
  }
}
