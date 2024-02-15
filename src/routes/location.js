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

    for (const comment of allComments) {
      if (comment.postUrl === pageUrl) {
        if (
          comment.allowPublic === true ||
          comment.creator.email === loginUser.email ||
          comment.publicUsers.find(
            (user) => user.toString() === loginUser._id.toString(),
          )
        ) {
          pageComments.push(comment);
        }
      }
    }

    res.status(200).json({ pageComments });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to get comments." });
  }
});

module.exports = router;
