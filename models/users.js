module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  },
  {timestamps: false},
  {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.photos);
      }
    }
  });

  return Users;
};