module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, // id, createdAt, updatedAt => 필드 자동 생성
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
