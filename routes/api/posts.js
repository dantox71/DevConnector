const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Already logged in user
      const user = await User.findById(req.user.id).select("-password");

      const { name, avatar } = user;
      const { text } = req.body;

      //Create new post object
      const newPost = new Post({
        text,
        name,
        avatar,
        user: req.user.id
      });

      //Save post in database
      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/posts/:post_id
// @desc    Get one post by id
// @access  Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res
        .status(404)
        .json({ msg: `Post with ${req.params.post_id} doesn't exist` });
    }

    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res
        .status(404)
        .json({ msg: `Post with ${req.params.post_id} doesn't exist` });
    }

    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
