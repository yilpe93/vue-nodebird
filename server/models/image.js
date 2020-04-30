module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      content: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, // createdAt, updatedAt
    {
      chartset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  Image.associate = (db) => {
    db.Image.belongsTo(db.Post); // PostId
  };

  return Image;
};
