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
        questions.belongsTo(models.Users);
        questions.belongsToMany(models.Users, { through: models.QuestionMembers})
      }
    }
  });
  return questions;
};