/*jshint esversion:6*/
const Sequelize = require('sequelize');
const Users = require('./users');

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("photos", {
    link: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  },
  {timestamps: false});

  Photo.associate = function(models) {
    Photo.belongsTo(models.users,  {
      foreignKey: {
        name: 'author_id',
        allowNull: false
      }
    });
  };

  return Photo;
};