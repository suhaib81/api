'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'uploadId', {
      type: Sequelize.STRING,
      references: { model: 'Uploads', key: 'uploadId' },
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'uploadId');
  }
};
