'use strict';
module.exports = function(sequelize, DataTypes) {
  var posts = sequelize.define('posts', {
    type: { type: DataTypes.ENUM, values: ['message', 'file'], allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    metadata: { type: DataTypes.HSTORE }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return posts;
};