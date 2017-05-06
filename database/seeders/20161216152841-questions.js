'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Questions', [{
      title: 'I want change my house doctor, do you know a good one?',
      status: 'open',
      content: 'Looking for a doctor in Amsterdam region',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'A title for test question4 pick up?',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      status: 'picked-up',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'A title for test question5 pick up?',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      status: 'answered',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Questions', null, {});
  }
};
