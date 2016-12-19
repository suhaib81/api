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
        questionMembers.belongsTo(models.Questions,{as:'Questions',foreignKey: 'questionId',onDelete: 'cascade'});
        questionMembers.belongsTo(models.Users,{as:'Users',foreignKey: 'userId',onDelete: 'cascade'});
      }
    }
  });
  return questionMembers;
};