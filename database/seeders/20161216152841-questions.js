'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Questions', [{
      title:'I want change my house doctor, do you know a good one?',
      status:'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Questions', null, {});
  }
};
