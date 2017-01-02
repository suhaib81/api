'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('QuestionsUsers', [{
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
    },{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:5
    },{
      role:'volunteer',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:1,
      questionId:5
    },{
      role:'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:6
    },{
      role:'volunteer',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:1,
      questionId:6
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuestionsUsers', null, {});
  }
};
