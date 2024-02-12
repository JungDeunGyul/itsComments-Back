const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

router.get("/", async function (req, res, next) {
  try {
    const { pageUrl, userId } = req.query;
    const allComments = await Comment.find().populate("creator");
    const loginUser = await User.findById(userId);

    if (!loginUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const pageComments = [];

    res.status(200).json({ pageComments });
  } catch (error) {
    return res.status(400).json({ message: "Failed to get comments." });
  }
});

module.exports = router;
