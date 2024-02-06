const express = require("express");

const router = express.Router();

const { Comment } = require("../models/Comment");

router.get("/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Failed to get comments." });
    }

    res.status(200).json({
      message: "success",
      comments: {
        commentId: comment._id,
        description: comment.description,
        creator: comment.creator,
        postUrl: comment.postUrl,
        postCoordinate: {
          x: comment.postCoordinate.x,
          y: comment.postCoordinate.y,
        },
        imgpath: comment.imgpath,
        allowPublic: comment.allowPublic,
        publicUsers: comment.publicUsers,
        maillingAddress: comment.maillingAddress,
        reComments: comment.reComments,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Failed to get comments" });
  }
});

module.exports = router;
