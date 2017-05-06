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
      type: DataTypes.STRING,
      defaultValue: 'en',
      allowNull: false
    },
    uploadId: {
      type: DataTypes.STRING
    },
    dob: { type: DataTypes.DATE },
    phone: { type: DataTypes.STRING, defaultValue: '000-000-000', allowNull: false },
    gender: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING, defaultValue: 'Change Me To Your Gemeente', allowNull: false },
    education: { type: DataTypes.STRING },
    intro: { type: DataTypes.STRING },
    dateofstatus: { type: DataTypes.STRING },
    typeofpermit: { type: DataTypes.STRING }
  }, {
    classMethods: {
      associate: function(models) {

        users.belongsTo(models.Uploads, {
          as: 'uploads',
          foreignKey: 'uploadId',
          onDelete: 'cascade'
        });

        users.belongsToMany(models.Questions, {
          through: models.QuestionsUsers,
          as: 'Questions',
          foreignKey: 'userId',
          onDelete: 'cascade'
        });
      }
    }
  });
  return users;
};
