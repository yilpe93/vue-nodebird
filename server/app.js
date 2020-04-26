const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

const db = require("./models");
const passportConfig = require("./passport");

const app = express();

// db 시작
db.sequelize.sync({ force: true }); // [Dev서버 기준] 서버 재시작할 때마다 테이블 Reset, { force: true }
passportConfig();

/* Middleware */
app.use(morgan("dev"));
/* 
  # cols 관련 HTTP Header
  Access-Control-Allow-Origin
  Access-Control-Allow-Credentials
*/
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie("cookiesecret"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "cookiesecret",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello Server");
});

app.post("/user/resigter", async (req, res, next) => {
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
        console.error("err", err);
        return next(err);
      }

      // 잘 못된 요청, 회원 정보가 없던가, 비밀번호가 틀리거나
      if (info) {
        return res.status(401).send(info.reason);
      }

      return req.login(user, async (err) => {
        // 세션에 사용자 저장, 이때 serializeUser가 실행된다.
        if (err) {
          console.error("err", err);
          return next(err);
        }

        return res.json(user);
      });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

app.post("/user/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("err", err);
      return next(err);
    }

    // 잘 못된 요청, 회원 정보가 없던가, 비밀번호가 틀리거나
    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (err) => {
      // 세션에 사용자 저장, 이때 serializeUser가 실행된다.
      if (err) {
        console.error("err", err);
        return next(err);
      }
      return res.json(user);
    });
  })(req, res, next);
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중..`);
});
