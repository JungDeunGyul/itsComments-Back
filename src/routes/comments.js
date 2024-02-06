const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

router.post("/new", async function (req, res, next) {
  try {
    const {
      userData,
      description,
      postDate,
      postUrl,
      postCoordinate,
      imgpath,
      allowPublic,
      publicUsers,
      maillingAddress,
    } = req.body;

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (description.length > 200) {
      return res
        .status(400)
        .json({ message: "The number of characters exceeded 200." });
    }

    if (!description) {
      return res.status(400).json({ message: "Comment description is empty." });
    }

    const newComment = await Comment.create({
      creator: user._id,
      description,
      postDate,
      postUrl,
      postCoordinate,
      imgpath,
      allowPublic,
      publicUsers,
      maillingAddress,
    });

    user.createdPapers.push(newComment._id);
    await user.save();

    res.status(200).json({ newComment });
  } catch (error) {
    return res.status(400).json({ message: "Comment creation failed." });
  }
});

router.get("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Failed to get comments." });
    }

    res.status(200).json({
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

router.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    const user = await User.findById(comment.creator);

    if (!comment) {
      return res.status(404).json({ message: "No such comment was found." });
    }

    if (!user) {
      return res.status(404).json({ message: "Creator not found" });
    }

    user.createdComments = user.createdComments.filter(
      (comment) => comment.toString() !== commentId,
    );

    await user.save();

    for (const reComment of comment.reComments) {
      const writer = await User.findById(reComment.creator);

      writer.participatedComments = writer.participatedComments.filter(
        (comment) => comment.toString() !== commentId,
      );

      await writer.save();
    }

    await comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "comment was successfully deleted." });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete a comment." });
  }
});

module.exports = router;
