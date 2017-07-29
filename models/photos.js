module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photos", {
    author_id: { type: Sequelize.INTEGER, references: {model: Users, key: 'id'}, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE},
    link: {type: Sequelize.STRING, allowNull: false},
    description: {type: Sequelize.STRING, allowNull: false}
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(Users);
      }
    }
  });

  return Photo;
};