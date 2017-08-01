module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    author: DataTypes.STRING
  },
  {timestamps: false},
  {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.Photos);
      }
    }
  });

  return Users;
};