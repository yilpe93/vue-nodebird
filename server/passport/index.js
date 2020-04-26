const passport = require("passport");
const local = require("./local");
const db = require("../models");

module.exports = () => {
  // 세션에 사용자를 저장할 때, 메모리 차원에서 UserId 만을 저장한다.
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  // 로그인 이후 모든 요청에 응답
  passport.deserializeUser(async (id, done) => {
    try {
      // 이후 캐싱처리..
      const user = await db.User.findOne({ where: { id } });
      return done(null, user); // req.user, req.isAuthenticaetd() === true
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });
  local();
};
