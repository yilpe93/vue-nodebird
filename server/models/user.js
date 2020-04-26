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
      },
      // createdAt, updatedAt => 테이블 자동 생성
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장되도록
    }
  );

  User.associate = (db) => {};

  return User;
};
