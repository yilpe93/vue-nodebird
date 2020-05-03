const passport = require("passport");
const local = require("./local");
const db = require("../models");

module.exports = () => {
  // 세션에 사용자를 저장할 때, 메모리 차원에서 UserId 만을 저장한다.
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  // 로그인 이후 모든 요청에 응답, 이에 요청에서 passport.authenticate()와 같이 login되었는지 확인할 수 있다.
  passport.deserializeUser(async (id, done) => {
    try {
      // 이후 캐싱처리..
      const user = await db.User.findOne({
        where: { id },
        attributes: ["id", "nickname"],
        include: [
          {
            model: db.Post,
            attributes: ["id"],
          },
          {
            model: db.User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: db.User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });

      return done(null, user); // req.user, passport.authenticate() === true
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });
  local();
};
