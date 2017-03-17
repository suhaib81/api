'use strict';
module.exports = function(sequelize, DataTypes) {
  var QuestionsUploads = sequelize.define('QuestionsUploads', {
    
  }, {
    // classMethods: {
    //   associate: function(models) {
    //     // QuestionsUploads.belongsTo(models.Questions, { foreignKey: 'questionId', onDelete: 'cascade' });
    //     // QuestionsUploads.belongsTo(models.Uploads, { foreignKey: 'uploadId', onDelete: 'cascade' });
    //   }
    // }
  });
  return QuestionsUploads;
};
