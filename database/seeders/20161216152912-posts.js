'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Posts', [{
      type:'message',
      message:"hello",
      metadata:{},
      createdAt: new Date(),
      updatedAt: new Date(),
      userId:1,
      questionId:1
    }], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
