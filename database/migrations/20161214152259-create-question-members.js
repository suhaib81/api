'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('questionMembers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            role: {
                type: DataTypes.ENUM,
                values: ['creator', 'volunteer', 'translator'], // etc...
                allowNull: false
            },
            lastViewedAt: {type: DataTypes.DATE, defaultValue: null},
            lastPostCount: {type: DataTypes.INTEGER, defaultValue: 0},
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
        return queryInterface.dropTable('questionMembers');
    }
};