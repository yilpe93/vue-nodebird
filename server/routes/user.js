const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const db = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  const user = req.user;
  res.json(user);
});

router.post("/resigter", isNotLoggedIn, async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;
    const exUser = await db.User.findOne({ where: { email } });

    // 이미 회원가입된 email 경우
    // HTTP STATUS CODE (400) => 잘 못된 요청
    // HTTP STATUS CODE (401) => 권한 없음
    // HTTP STATUS CODE (403) => 금지
    // HTTP STATUS CODE (404) => 페이지 없는 경우
    if (exUser) {
      return res.status(403).json({
        errorCode: 1, // front/back 상의할 수 있는 Code
        message: "이미 회원가입되어 있습니다.",
      });
    }

    // password 암호화
    const hash = await bcrypt.hash(password, 12);
    await db.User.create({ email, password: hash, nickname });
    // HTTP STATUS CODE (201) => 성공적으로 생성

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      // 잘 못된 요청, 회원 정보가 없던가, 비밀번호가 틀리거나
      if (info) {
        return res.status(401).send(info.reason);
      }

      return req.login(user, async (err) => {
        // 세션에 사용자 저장, 이때 serializeUser가 실행된다.
        if (err) {
          console.error(err);
          return next(err);
        }

        return res.json(user);
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    // 잘 못된 요청, 회원 정보가 없던가, 비밀번호가 틀리거나
    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (err) => {
      // 세션에 사용자 저장, 이때 serializeUser가 실행된다.
      if (err) {
        console.error(err);
        return next(err);
      }

      return res.json(user);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(); // 선택사항
  return res.status(200).send("로그아웃 되었습니다.");
});

module.exports = router;
