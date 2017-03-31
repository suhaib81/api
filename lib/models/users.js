'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('Users', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    secretHash: {
      type: DataTypes.STRING
    },
    secretHashIssuedAt: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.BOOLEAN
    },
    type: {
      type: DataTypes.ENUM,
      values: ['user', 'volunteer', 'translator', 'admin'],
      allowNull: false
    },
    language: {
      type: DataTypes.ENUM,
      values: ['en', 'ar', 'nl', 'others'],
      defaultValue: 'en',
      allowNull: false
    },
    dob: {type: DataTypes.DATE},
    phone:{type: DataTypes.STRING,defaultValue: '000-000-000',allowNull: false},
    gender: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING,defaultValue: 'Change Me To Your Gemeente', allowNull: false},
    education : {type: DataTypes.STRING},
    intro: {type: DataTypes.STRING},
    dateofstatus:{type: DataTypes.STRING},
    typeofpermit:{type: DataTypes.STRING}
  }, {
    classMethods: {
      associate: function(models) {
        users.hasMany(models.QuestionsUsers, { foreignKey: 'userId', onDelete: 'cascade' });
        users.belongsToMany(models.Questions, {
          through: models.QuestionsUsers,
          as: 'Questions',
          foreignKey: 'questionId',
          onDelete: 'cascade'
        });
      }
    }
  });
  return users;
};
