'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      secretHash: {
        type: Sequelize.STRING
      },
      secretHashIssuedAt: {
        type: Sequelize.DATE
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      type: {
        type: Sequelize.ENUM,
        values: ['user', 'volunteer', 'translator', 'admin'],
        allowNull: false
      },
      language: {
        type: Sequelize.STRING,
        defaultValue: 'en',
        allowNull: false
      },
      dob: {type: Sequelize.DATE},
      phone: {type: Sequelize.STRING, defaultValue: '000-000-000', allowNull: false},
      gender: {type: Sequelize.STRING},
      city: {type: Sequelize.STRING, defaultValue: 'Change Me To Your Gemeente', allowNull: false},
      education: {type: Sequelize.STRING},
      intro: {type: Sequelize.STRING},
      dateofstatus: {type: Sequelize.STRING},
      typeofpermit: {type: Sequelize.STRING},
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
