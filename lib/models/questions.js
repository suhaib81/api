'use strict';
module.exports = function(sequelize, DataTypes) {
  var questions = sequelize.define('questions', {
    id: DataTypes.INTEGER,
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
        // associations can be defined here
      }
    }
  });
  return questions;
};