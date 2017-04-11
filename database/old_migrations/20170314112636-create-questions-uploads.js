'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('QuestionsUploads', {
      uploadId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'Uploads', key: 'uploadId' },
        primaryKey: true
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Questions', key: 'questionId' },
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('QuestionsUploads');
  }
};