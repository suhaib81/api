'use strict';
module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define('Users', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        secretHash: {
            type: DataTypes.STRING
        },
        secretHashIssuedAt: {
            type: DataTypes.DATE
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        type: {
            type: DataTypes.ENUM,
            values: ['user', 'volunteer', 'translator', 'admin'],
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                users.hasMany(models.QuestionMembers, {onDelete: 'cascade'});
                users.belongsToMany(models.question, {
                    through: models.QuestionMembers,
                    as: 'Questions',
                    foreignKey: 'questionId',
                    onDelete: 'cascade'
                });
            }
        }
    });
    return users;
};
