'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'daanaerts@gmail.com',
      password: '$2a$12$vLzqnwcE5Cj3Exu8wqYmGedzdl4A4GjkbPuqRU2hLLKjcwA.ps966',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
