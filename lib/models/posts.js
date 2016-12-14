'use strict';
module.exports = function(sequelize, DataTypes) {
  var posts = sequelize.define('posts', {
    type: { type: DataTypes.ENUM, values: ['message', 'file'], allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    metadata: { type: DataTypes.HSTORE }
  }, {
    classMethods: {
      associate: function(models) {
        posts.belongsTo(models.Users);
        posts.belongsTo(models.questions);
      }
    }
  });
  return posts;
};