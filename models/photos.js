/*jshint esversion:6*/
/*const Sequelize = require('sequelize');
const Users = require('./users');*/

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("photos", {
    title: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  },
  {timestamps: false});

  Photo.associate = function(models) {
    Photo.belongsTo(models.users,  {
      foreignKey: {
        name: 'user_id',
        allowNull: false
      }
    });
    Photo.belongsTo(models.authors,  {
      foreignKey: {
        name: 'author_id',
        allowNull: false
      }
    });
  };

  return Photo;
};