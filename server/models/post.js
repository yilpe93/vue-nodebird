module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false,
      },
    }, // id, createdAt, updatedAt => 필드 자동 생성
    {
      chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
      collate: "utf8mb4_general_ci",
    }
  );

  // associate => Model들 간의 관계를
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // Post는 User에 포함되어 있다. => UserId(User 모델과의 관계로 자동으로 추가 시켜준다.)
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, {
      through: "PostHashtag",
    }); // PostHashtag => 중간 테이블 역할
  };

  return Post;
};
