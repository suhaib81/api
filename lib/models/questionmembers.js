'use strict';
module.exports = function(sequelize, DataTypes) {
  var questionMembers = sequelize.define('questionMembers', {
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
        questionMembers.belongsTo(models.questions);
        questionMembers.belongsTo(models.Users);
      }
    }
  });
  return questionMembers;
};