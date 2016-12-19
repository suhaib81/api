'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('QuestionMembers', [{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:1,
      questionId:1
    }], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuestionMembers', null, {});
  }
};

