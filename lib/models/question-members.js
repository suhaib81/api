'use strict';
module.exports = function(sequelize, DataTypes) {
  var questionMembers = sequelize.define('QuestionMembers', {
    questionMemberId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    role: {
      type: DataTypes.ENUM,
      values: ['creator', 'volunteer', 'translator'], // etc...
      allowNull: false
    },
    lastViewedAt: { type: DataTypes.DATE, defaultValue: null },
    lastPostCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    classMethods: {
      associate: function(models) {
        questionMembers.belongsTo(models.Questions, {foreignKey: 'questionId'});
        questionMembers.belongsTo(models.Users,{foreignKey: 'userId'});
      }
    }
  });
  return questionMembers;
};