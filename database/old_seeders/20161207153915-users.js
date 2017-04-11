'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Test',
      lastName: 'Volunteer',
      email: 'testvolunteer@openembassy.nl',
      password: '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C',
      active: true,
      type: 'volunteer',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@openembassy.nl',
      password: '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C',
      active: true,
      type: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Admin',
      lastName: 'User',
      email: 'adminuser@openembassy.nl',
      password: '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C',
      active: true,
      type: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Translator',
      lastName: 'User',
      email: 'translatoruser@openembassy.nl',
      password: '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C',
      active: true,
      type: 'translator',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
