module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
      collate: "utf8mb4_general_ci",
    }
  );

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // UserId
    db.Comment.belongsTo(db.Post); // PostId
  };

  return Comment;
};

/* 
  # 모델 관계
  1:1   => (hasOne, belongsTo)
  1:다  => (hasMany, belongsTo)
  다:다 => (belongsToMany)
*/
