module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );

  Hashtag.associate = (db) => {
    // belongsToMany => 다:다
    db.Hashtag.belongsToMany(db.Post, {
      through: "PostHashtag",
    }); // PostHashtag => 중간 테이블 역할
  };

  return Hashtag;
};
