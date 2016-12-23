'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Questions', [{
      title:'I want change my house doctor, do you know a good one?',
      status:'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: 5
    },{
      title:'A title for test question1?',
      status:'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: 5
    },{
      title:'A title for test question2?',
      status:'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: 5
    },{
      title:'A title for test question3?',
      status:'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: 5
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Questions', null, {});
  }
};
