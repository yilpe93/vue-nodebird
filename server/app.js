const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("./models");

const app = express();

// db 시작
db.sequelize.sync({ force: true }); // [Dev서버 기준] 서버 재시작할 때마다 테이블 Reset, { force: true }

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello Server");
});

app.post("/user/resigter", async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    const exUser = await db.User.findOne({ email });

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
    password = await bcrypt.hash(password, 12);

    const newUser = await db.User.create({ email, password, nickname });
    // HTTP STATUS CODE (201) => 성공적으로 생성
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중..`);
});
