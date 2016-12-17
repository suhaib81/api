'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('QuestionsMembers', [{
      role:'creator',
      lastViewedAt:new Date(),
      lastPostCount:0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:1,
      questionId:1
    }], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuestionsMembers', null, {});
  }
};

