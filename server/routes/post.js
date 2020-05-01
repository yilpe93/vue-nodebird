const express = require("express");
const multer = require("multer");
const path = require("path");

const db = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 확장자 뽑아오기
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + Date.now() + ext);
    },
  }),
  limit: { fileSize: 20 * 1024 * 1024 },
});

/* 
  # upload
  - single: 파일 하나
  - array: 같은 키로 여러 개
  - fields: 다른 키로 여러 개
  - none: 파일 업로드 X
*/
router.post("/images", isLoggedIn, upload.array("image"), (req, res) => {
  res.json(req.files.map((v) => v.filename));
});

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { content, image } = req.body;
    const hashtags = content.match(/#[^\s#]+/g);
    const newPost = await db.Post.create({
      content,
      UserId: req.user.id,
    });

    if (image) {
      if (Array.isArray(image)) {
        await Promise.all(
          image.map((img) => {
            return db.Image.create({ src: img, PostId: newPost.id });
          })
        );
      } else {
        await db.Image.create({ src: image, PostId: newPost.id });
      }
    }

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          db.hashtags.findOrCreate({
            // findOrCreate => DB에 있어면 찾고 없으면 저장
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );

      await newPost.addHashtags(result.map((r) => r[0]));
      // db.sequlize.query(`SQL문`);
    }

    /* 
      newPost에서의 UserId 만으로는 연결된 대상을 찾지 못하여, 
      `include` 키를 통하여 해당 db.User의 id와 맵핑하여 해당 유저를 찾고,
      찾은 유저의 모든 속성을 가지고 올 필요는 없기에 `attributes` 키를 통하여 필요한 요소만을 추출
    */
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
        {
          model: db.Image,
        },
      ],
    });

    return res.json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Post Modify
router.put("/:id", async (req, res, next) => {});

// Post Delete
router.delete("/:id", async (req, res, next) => {
  try {
    await db.Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send("삭제했습니다.");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Get Comments in Post
router.get("/:id/comments", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      includes: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
      ],
      order: [["createdAt", "ASC"]],
      // ASC => 오름차순, DESC => 내림차순
    });

    return res.json(comments);
  } catch (err) {
    next(err);
  }
});

// Create Comment in Post
router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });

    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
      ],
    });

    return res.json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
