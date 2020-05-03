const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const db = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  const user = req.user;
  return res.json(user);
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;
    // password 암호화
    const hash = await bcrypt.hash(password, 12);
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

        const fullUser = await db.User.findOne({
          where: { id: user.id },
          attributes: ["id", "email", "nickname"],
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

        return res.json(fullUser);
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [
        {
          model: db.Post,
          as: "Posts",
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
      attributes: ["id", "nickname"],
    });

    return res.json(user);
  } catch (err) {
    console.error(err);
    next(err);
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
      // 세션에다 사용자 정보 저장 [serializeUser]
      if (err) {
        console.error(err);
        return next(err);
      }

      const fullUser = await db.User.findOne({
        where: { id: user.id },
        attributes: ["id", "email", "nickname"],
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

      return res.json(fullUser);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(); // 선택사항
  return res.status(200).send("로그아웃 되었습니다.");
});

router.get("/:id/posts", async (req, res, next) => {
  try {
    let where = {
      UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      RetweetId: null,
    };

    if (parseInt(req.query.lastId, 10)) {
      where[db.Sequelize.Op.lt] = parseInt(req.query.lastId, 10);
    }

    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]], // ASC => 오름차순, DESC => 내림차순
    });

    return res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// patch => 부분 수정
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );

    res.send(req.body.nickname);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 팔로잉 API
router.get("/:id/followings", isLoggedIn, async (req, res, next) => {
  try {
    let where = {};

    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.gt]: parseInt(req.query.lastId, 10),
        },
      };
    }

    const me = await db.User.findOne({ where: { id: req.user.id } });

    const followings = await me.getFollowings({
      where,
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit || 3, 10),
    });

    return res.json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });

    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });

    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 팔로워 API
router.get("/:id/followers", isLoggedIn, async (req, res, next) => {
  try {
    let where = {};

    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.gt]: parseInt(req.query.lastId, 10),
        },
      };
    }

    const me = await db.User.findOne({ where: { id: req.user.id } });

    const followers = await me.getFollowers({
      where,
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit || 3, 10),
    });

    return res.json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id/follower", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.params.id },
    });

    await me.removeFollower(req.params.id);
    return res.send(req.params.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
