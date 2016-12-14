'use strict';
module.exports = function(sequelize, DataTypes) {
  var questions = sequelize.define('questions', {
    id: {
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
        questions.hasMany(models.posts);
        questions.hasMany(models.questionMembers);
        questions.belongsTo(models.Users, { as: 'creator' });
        questions.belongsToMany(models.Users, { through: models.questionMembers })
      }
    }
  });
  return questions;
};