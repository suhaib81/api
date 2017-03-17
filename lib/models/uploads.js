'use strict';
module.exports = function(sequelize, DataTypes) {
  var Uploads = sequelize.define('Uploads', {
    uploadId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    inUse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // Uploads.hasMany(models.QuestionsUploads, { foreignKey: 'uploadId', onDelete: 'cascade' });
        console.log(models.QuestionsUploads);
        console.log(models.Questions);
        
        Uploads.belongsToMany(models.Questions, {
          through: models.QuestionsUploads,
          as: 'questions',
          foreignKey: 'uploadId',
          onDelete: 'cascade'
        });
      }
    }
  });
  return Uploads;
};
