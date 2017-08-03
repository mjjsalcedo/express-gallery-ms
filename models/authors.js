module.exports = function(sequelize, DataTypes) {
  var Authors = sequelize.define("authors", {
    author: DataTypes.STRING
  },
  {timestamps: false},
  {
    classMethods: {
      associate: function(models) {
        Authors.hasMany(models.photos);
      }
    }
  });

  return Authors;
};