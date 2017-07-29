/*jshint esversion:6*/
const Sequelize = require('sequelize');
const Users = require('./users');

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photos", {
    link: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(models.Users,  {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Photo;
};