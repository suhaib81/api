'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('QuestionsUsers', [{
      role: 'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
      questionId: 1
    }, {
      role: 'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
      questionId: 2
    }, {
      role: 'volunteer',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      questionId: 2
    }, {
      role: 'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
      questionId: 3
    }], {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuestionsUsers', null, {});
  }
};
