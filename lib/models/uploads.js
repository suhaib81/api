'use strict';
module.exports = function(sequelize, DataTypes) {
  var Uploads = sequelize.define('Uploads', {
    uploadId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inUse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
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
