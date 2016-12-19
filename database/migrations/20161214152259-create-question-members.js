'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('QuestionMembers', {
            questionsMembersId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            role: {
                type: Sequelize.ENUM,
                values: ['creator', 'volunteer', 'translator'], // etc...
                allowNull: false
            },
            lastViewedAt: {type: Sequelize.DATE, defaultValue: null},
            lastPostCount: {type: Sequelize.INTEGER, defaultValue: 0},
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: 'Users', key: 'userId' },
                allowNull: false
            },
            questionId: {
                type: Sequelize.INTEGER,
                references: { model: 'Questions', key: 'questionId' },
                allowNull: false
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('QuestionMembers');
    }
};