'use strict';
module.exports = function(sequelize, DataTypes) {
  var Questions = sequelize.define('Questions', {
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
        Questions.hasMany(models.Posts, { foreignKey: 'questionId', onDelete: 'cascade' });
        
        
        Questions.belongsToMany(models.Uploads, {
          through: models.QuestionsUploads,
          as: 'uploads',
          foreignKey: 'questionId',
          onDelete: 'cascade'
        });

        Questions.hasMany(models.QuestionsUsers, { foreignKey: 'questionId', onDelete: 'cascade' });
        Questions.belongsTo(models.Users, { as: 'Users', foreignKey: 'userId', onDelete: 'cascade' });
        Questions.belongsToMany(models.Users, {
          through: models.QuestionsUsers,
          as: 'Users',
          foreignKey: 'userId',
          onDelete: 'cascade'
        });
      }
    }
  });
  return Questions;
};
