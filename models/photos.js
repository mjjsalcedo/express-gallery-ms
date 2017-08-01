/*jshint esversion:6*/
const Sequelize = require('sequelize');
const Users = require('./users');

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("photos", {
    link: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  });

  Photo.associate = function(models) {
    Photo.belongsTo(models.users,  {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Photo;
};