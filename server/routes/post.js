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
  return res.json(req.files.map((v) => v.filename));
});

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { content, image } = req.body;
    const hashtags = content.match(/#[^\s#]+/g);
    const newPost = await db.Post.create({
      content,
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          db.Hashtag.findOrCreate({
            // findOrCreate => DB에 있어면 찾고 없으면 저장
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );

      await newPost.addHashtags(result.map((r) => r[0]));
      // db.sequlize.query(`SQL문`);
    }

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
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });

    return res.json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Get Post/:id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
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
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
    });

    return res.json(post);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Put Post/:id
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
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
      ],
      order: [["createdAt", "ASC"]], // ASC => 오름차순, DESC => 내림차순
    });

    return res.json(comments);
  } catch (err) {
    console.error(err);
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

// Retweet
router.post("/:id/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.Post,
          as: "Retweet", // 리트윗한 게시글이면 원본 게시글이 됨
        },
      ],
    });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }

    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }

    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId, // 원본 아이디
      content: "retweet",
    });

    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
    });

    return res.json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Add Liker
router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    await post.addLiker(req.user.id);
    return res.json({ userId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Delete Liker
router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    await post.removeLiker(req.user.id);
    return res.json({ userId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
