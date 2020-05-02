module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(100), // 40자 이내
        allowNull: false, // 필수
        unique: true, // 중복 금지
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      }, // id, createdAt, updatedAt => 필드 자동 생성
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장되도록
    }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Post); // User는 게시글(Post)를 여러개 가질 수 있다.
    db.User.hasMany(db.Comment);
    // 좋아요 (N:M 관계)
    db.User.belongsToMany(db.Post, {
      through: "Like",
      as: "Liked",
    });
    // Follower, Following (N:M 관계)
    db.User.belongsToMany(db.User, {
      through: "Follow",
      foreignKey: "followingId",
      as: "Followers",
    }); // 자신을 Follower하는 User, 'foreignKey'와 'as'는 상반되는 관계
    db.User.belongsToMany(db.User, {
      through: "Follow",
      foreignKey: "followerId",
      as: "Followings",
    }); // 자신이 Following하는 User
  };

  return User;
};
