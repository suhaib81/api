'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Posts', [{
      type:'message',
      message:"hello",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:5,
      questionId:1
    }], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
