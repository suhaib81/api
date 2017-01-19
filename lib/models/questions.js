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
    content: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      values: ['open', 'picked-up', 'answered'], // etc...
      allowNull: false,
      defaultValue: 'open'
    }
  }, {
    classMethods: {
      associate: function(models) {
        questions.hasMany(models.Posts, { foreignKey: 'questionId', onDelete: 'cascade' });
        questions.hasMany(models.QuestionsUsers, { foreignKey: 'questionId', onDelete: 'cascade' });
        questions.belongsTo(models.Users, { as: 'Users', foreignKey: 'userId', onDelete: 'cascade' });
        questions.belongsToMany(models.Users, {
          through: models.QuestionsUsers,
          as: 'Users',
          foreignKey: 'userId',
          onDelete: 'cascade'
        })
      }
    }
  });
  return questions;
};
