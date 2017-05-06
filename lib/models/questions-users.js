'use strict';
module.exports = function(sequelize, DataTypes) {
  var questionsUsers = sequelize.define('QuestionsUsers', {
    role: {
      type: DataTypes.ENUM,
      values: ['creator', 'volunteer', 'translator'], // etc...
      allowNull: false
    },
    lastViewedAt: { type: DataTypes.DATE, defaultValue: null },
    lastPostCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
    }
  });
  return questionsUsers;
};
