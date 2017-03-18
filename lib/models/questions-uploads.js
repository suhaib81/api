'use strict';
module.exports = function(sequelize, DataTypes) {
  var QuestionsUploads = sequelize.define('QuestionsUploads', {}, {});
  return QuestionsUploads;
};
