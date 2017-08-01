module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    author: DataTypes.STRING
  },
  {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.Photos);
      }
    }
  });

  return Users;
};