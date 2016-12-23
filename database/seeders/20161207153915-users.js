'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'daanaerts@gmail.com',
      password: '$2a$12$vLzqnwcE5Cj3Exu8wqYmGedzdl4A4GjkbPuqRU2hLLKjcwA.ps966',
      active: true,
      type:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'test1@openembassy.nl',
      password: '$2a$12$3C9T8.9BSx1DoGgG7OyIuOmX1HIw/QI9fFC3IgIno6QSx632iM9LG',
      active: true,
      type:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'test2@openembassy.nl',
      password: '$2a$12$3C9T8.9BSx1DoGgG7OyIuOmX1HIw/QI9fFC3IgIno6QSx632iM9LG',
      active: true,
      type:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'test3@openembassy.nl',
      password: '$2a$12$3C9T8.9BSx1DoGgG7OyIuOmX1HIw/QI9fFC3IgIno6QSx632iM9LG',
      active: true,
      type:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      firstName: 'leo',
      lastName: 'frank',
      email: 'leofrank@gmail.com',
      password: '$2a$12$3C9T8.9BSx1DoGgG7OyIuOmX1HIw/QI9fFC3IgIno6QSx632iM9LG',
      active: true,
      type:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'test5@openembassy.nl',
      password: '$2a$12$3C9T8.9BSx1DoGgG7OyIuOmX1HIw/QI9fFC3IgIno6QSx632iM9LG',
      active: true,
      type:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
