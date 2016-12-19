'use strict';
module.exports = function (sequelize, DataTypes) {
    var posts = sequelize.define('Posts', {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        type: {type: DataTypes.ENUM, values: ['message', 'file'], allowNull: false},
        message: {type: DataTypes.STRING, allowNull: false},
        metadata: {type: DataTypes.HSTORE}
    }, {
        classMethods: {
            associate: function (models) {
                posts.belongsTo(models.Users, {foreignKey: 'userId'});
                posts.belongsTo(models.Questions, {foreignKey: 'questionId'});
            }
        }
    });
    return posts;
};