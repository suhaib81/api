'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('QuestionMembers', [{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:1
    },{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:2
    },{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:3
    },{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:4
    }], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuestionMembers', null, {});
  }
};

