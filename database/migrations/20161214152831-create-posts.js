'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Posts', {
            postId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            type: {type: Sequelize.ENUM, values: ['message', 'file'], allowNull: false},
            message: {type: Sequelize.STRING, allowNull: false},
            metadata: {type: Sequelize.JSONB},
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
        return queryInterface.dropTable('Posts');
    }
};