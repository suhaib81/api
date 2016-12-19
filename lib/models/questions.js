'use strict';
module.exports = function(sequelize, DataTypes) {
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
      associate: function(models) {
        questions.hasMany(models.Posts);
        questions.hasMany(models.QuestionMembers);
        Question.belongsTo(models.Users, { as: 'creator',foreignKey: 'creatorId' });
        Question.belongsToMany(models.Users, { through: models.QuestionMembers, foreignKey: 'questionId' })
      }
    }
  });
  return questions;
};