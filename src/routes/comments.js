const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

router.post("/new", async function (req, res, next) {
  try {
    const {
      userData,
      text,
      postDate,
      postUrl,
      postCoordinate,
      screenshot,
      allowPublic,
      publicUsers,
      recipientEmail,
    } = req.body;

    const user = await User.findOne({ email: userData.email }).populate(
      "friends",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (text.length > 200) {
      return res
        .status(400)
        .json({ message: "The number of characters exceeded 200." });
    }

    if (!text) {
      return res.status(400).json({ message: "Comment text is empty." });
    }

    const newComment = await Comment.create({
      creator: user._id,
      text,
      postDate,
      postUrl,
      postCoordinate,
      screenshot,
      allowPublic,
      publicUsers,
      recipientEmail,
    });

    user.createdComments.push(newComment._id);
    await user.save();

    if (newComment.publicUsers) {
      for (const publicUser of newComment.publicUsers) {
        const visibleTo = user.friends.find(
          (friend) => friend.nickname === publicUser,
        );

        visibleTo.feedComments.push(newComment._id);
        visibleTo.receivedComments.push(newComment._id);

        await visibleTo.save();
      }
    }

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

    const userId = req.query.userId;

    if (comment.allowPublic === false) {
      if (!userId && !comment.publicUsers.find(userId)) {
        return res.status(401).json({ error: "You do not have access." });
      }
    }

    const user = await User.findById(userId);
    user.feedComments = user.feedComments.filter(
      (comment) => comment._id.toString() !== commentId,
    );

    await user.save();

    res.status(200).json({
      comments: {
        commentId: comment._id,
        text: comment.text,
        creator: comment.creator,
        postUrl: comment.postUrl,
        postCoordinate: {
          x: comment.postCoordinate.x,
          y: comment.postCoordinate.y,
        },
        screenshot: comment.screenshot,
        allowPublic: comment.allowPublic,
        publicUsers: comment.publicUsers,
        recipientEmail: comment.recipientEmail,
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

    if (!comment) {
      return res.status(404).json({ message: "No such comment was found." });
    }

    const user = await User.findById(comment.creator);

    if (!user) {
      return res.status(404).json({ message: "Creator not found" });
    }

    user.createdComments = user.createdComments.filter(
      (comment) => comment.toString() !== commentId,
    );

    await user.save();

    for (const reComment of comment.reComments) {
      const writer = await User.findById(reComment.creator);

      writer.repliedComments = writer.repliedComments.filter(
        (reply) => reply.comment.toString() !== commentId,
      );

      await writer.save();
    }

    for (const user of comment.publicUsers) {
      user.receivedComments = user.receivedComments.filter(
        (comment) => comment.toString() !== commentId,
      );
      user.feedComments = user.feedComments.filter(
        (comment) => comment.toString() !== commentId,
      );

      await user.save();
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "comment was successfully deleted." });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete a comment." });
  }
});

module.exports = router;
