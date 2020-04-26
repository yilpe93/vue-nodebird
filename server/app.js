const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello Server");
});

app.post("/user", (req, res) => {
  const { email, nickname, password } = req.body;
  console.log(email, nickname, password);
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중..`);
});
