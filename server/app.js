const express = require("express");
const cors = require("cors");
// const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

const db = require("./models");
const passportConfig = require("./passport");
const userRouter = require("./routes/user");

const app = express();

// db 시작
// [Dev서버 기준] 서버 재시작할 때마다 테이블 Reset, { force: true }
db.sequelize.sync();
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

app.use("/user", userRouter);

app.post("/post", (req, res) => {
  if (passport.authenticate()) {
  }
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중..`);
});
