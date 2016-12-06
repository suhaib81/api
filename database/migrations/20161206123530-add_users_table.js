'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.dropAllTables();
    // return queryInterface.createTable('users', { name: Sequelize.INTEGER });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
