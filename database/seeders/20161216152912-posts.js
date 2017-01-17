'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Posts', [{
      type: 'message',
      message: "hello",
      metadata: JSON.stringify({}),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
      questionId: 2
    }], {});

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
