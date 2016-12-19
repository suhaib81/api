'use strict';
module.exports = function (sequelize, DataTypes) {
    var questions = sequelize.define('Questions', {
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM,
            values: ['open', 'picked-up', 'answered'], // etc...
            allowNull: false,
            defaultValue: 'open'
        },
    }, {
        classMethods: {
            associate: function (models) {
                questions.hasMany(models.Posts, {onDelete: 'cascade'});
                questions.hasMany(models.QuestionMembers, {onDelete: 'cascade'});
                Question.belongsTo(models.Users, {as: 'Users', foreignKey: 'creatorId', onDelete: 'cascade'});
                Question.belongsToMany(models.Users, {
                    through: models.QuestionMembers,
                    as: 'Questions',
                    foreignKey: 'questionId',
                    onDelete: 'cascade'
                })

            }
        }
    });
    return questions;
};