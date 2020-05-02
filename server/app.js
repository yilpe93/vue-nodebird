const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

const db = require("./models");
// Passport Config
const passportConfig = require("./passport");
// Routes
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");

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
    origin: "http://localhost:3080",
    credentials: true,
  })
);
// 정적파일 제공해주기 위해 (프론트 접근 url, 백 제공 폴더) => 서버 주소와 프론트 주소는 웬만하면 다르게, 백의 주소 노출 위험
app.use("/", express.static("uploads"));
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
app.use("/post", postRouter);
app.use("/posts", postsRouter);

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중..`);
});
