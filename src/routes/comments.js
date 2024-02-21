const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { Comment } = require("../models/Comment");
const s3Uploader = require("../middleware/s3Uploader");
const { sendMail } = require("../utiles/mailSender");
const { checkMails } = require("../utiles/mailChecker");

let clients = [];
let commentsSSE = [];

const sendUserDataToClients = (updateUserData, friendId) => {
  const client = clients.find((client) => client.friendId === friendId);

  if (client) {
    client.write(`data: ${JSON.stringify(updateUserData)}\n\n`);
  }
};

const sendUpdatedCommentToClients = (updateCommentData, commentId) => {
  const comment = commentsSSE.find((res) => res.comment === commentId);

  if (comment) {
    comment.write(`data: ${JSON.stringify(updateCommentData)}\n\n`);
  }
};

router.post(
  "/new",
  s3Uploader.single("screenshot"),
  async function (req, res, next) {
    try {
      const {
        userData,
        text,
        postDate,
        postUrl,
        postCoordinate,
        allowPublic,
        publicUsers,
        recipientEmail,
      } = req.body;

      const user = await User.findOne({ email: userData }).populate("friends");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const imageKey = req.file.key;

      const screenshot = `${process.env.CLOUD_FROUNT}/${imageKey}`;
      const commentPosition = JSON.parse(postCoordinate);
      const taggedUser = JSON.parse(publicUsers);
      const taggedUsersList = [];

      if (taggedUser) {
        for (const publicUser of taggedUser) {
          const taggedFriends = user.friends.find(
            (friend) => friend.nickname === publicUser,
          );

          taggedUsersList.push(taggedFriends._id);
        }
      }

      if (text.length > 200) {
        return res
          .status(400)
          .json({ message: "The number of characters exceeded 200." });
      }

      if (!text) {
        return res.status(400).json({ message: "Comment text is empty." });
      }

      if (recipientEmail) {
        if (checkMails(recipientEmail)) {
          const mailSent = await sendMail(
            recipientEmail,
            userData,
            text,
            postUrl,
            screenshot,
          );

          if (!mailSent) {
            return res.status(500).json({ message: "Failed to send email." });
          }
        } else {
          return res.status(400).json({ message: "Invalid email address." });
        }
      }

      const newComment = await Comment.create({
        creator: user._id,
        text,
        postDate,
        postUrl,
        postCoordinate: commentPosition,
        screenshot,
        allowPublic,
        publicUsers: taggedUsersList,
        recipientEmail,
      });

      user.createdComments.push(newComment._id);

      if (user._id.toString() === process.env.NON_MEMBER) {
        setTimeout(
          async () => {
            await Comment.deleteOne({ _id: newComment._id });
          },
          60 * 60 * 1000,
        );
      }

      await user.save();

      if (newComment.publicUsers) {
        for (const publicUser of newComment.publicUsers) {
          const taggedFriends = user.friends.find(
            (friend) => friend._id === publicUser,
          );

          taggedFriends.feedComments.push(newComment._id);
          taggedFriends.receivedComments.push(newComment._id);

          await taggedFriends.save();

          const updateUserData = await User.findById(publicUser)
            .populate("friends")
            .populate({ path: "feedComments", populate: { path: "creator" } });

          sendUserDataToClients(updateUserData, taggedFriends._id.toString());
        }
      }

      res.status(200).json({ newComment });
    } catch (error) {
      return res.status(400).json({ message: "Comment creation failed." });
    }
  },
);

router.get("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.query.userId;
    const comment = await Comment.findById(commentId)
      .populate("creator")
      .populate({ path: "reComments", populate: { path: "creator" } });

    if (!comment) {
      return res.status(404).json({ error: "Failed to get comments." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.feedComments = user.feedComments.filter(
      (comment) => comment.toString() !== commentId,
    );

    await user.save();

    res.status(200).json({
      comments: {
        commentId: comment._id,
        text: comment.text,
        creator: comment.creator,
        postDate: comment.postDate,
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

router.patch("/recomments", async (req, res, next) => {
  try {
    const { userId, commentId, replyId, postDate, text, action } = req.body;

    if (action === "delete") {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "No such comment was found." });
      }

      const user = await User.findById(comment.creator);

      if (!user) {
        return res.status(404).json({ message: "Creator not found" });
      }

      const recomment = comment.reComments.find(
        (recomment) => recomment._id.toString() === replyId,
      );

      if (!recomment) {
        return res
          .status(404)
          .json({ message: "No such recomment was found." });
      }

      const isRecommentCreator = recomment.creator.toString() === userId;
      const isCommentCreator = comment.creator.toString() === userId;

      if (isRecommentCreator || isCommentCreator) {
        comment.reComments = comment.reComments.filter(
          (recomment) => recomment._id.toString() !== replyId,
        );

        await comment.save();

        const writer = await User.findById(recomment.creator);

        if (!writer) {
          return res
            .status(404)
            .json({ message: "Recomment creator not found." });
        }

        writer.repliedComments = writer.repliedComments.filter(
          (reply) => reply.comment.toString() !== commentId,
        );

        await writer.save();

        sendUpdatedCommentToClients(comment, commentId);

        res.status(200).json({ message: "Recomment is successfully deleted." });
      }
    } else if (action === "update") {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const reComment = {
        text,
        creator: user._id,
        postDate,
      };

      comment.reComments.push(reComment);
      await comment.save();

      user.repliedComments.push({
        comment: comment._id,
        text,
      });

      await user.save();

      sendUpdatedCommentToClients(comment, commentId);

      res
        .status(200)
        .json({ message: "Recomment created successfully", reComment });
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete a comment." });
  }
});

router.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { userId } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "No such comment was found." });
    }

    const user = await User.findById(comment.creator)
      .populate({
        path: "createdComments",
        populate: {
          path: "creator",
        },
      })
      .populate({
        path: "receivedComments",
        populate: {
          path: "creator",
        },
      });

    if (userId !== comment.creator.toString()) {
      return res
        .status(404)
        .json({ message: "You do not have permission to delete." });
    }

    if (!user) {
      return res.status(404).json({ message: "Creator not found" });
    }

    user.createdComments = user.createdComments.filter(
      (comment) => comment._id.toString() !== commentId,
    );

    await user.save();

    for (const reComment of comment.reComments) {
      const writer = await User.findById(reComment.creator);

      writer.repliedComments = writer.repliedComments?.filter(
        (reply) => reply.comment.toString() !== commentId,
      );

      await writer.save();
    }

    for (const userId of comment.publicUsers) {
      const user = await User.findById(userId);

      user.receivedComments = user.receivedComments?.filter(
        (comment) => comment.toString() !== commentId,
      );

      user.feedComments = user.feedComments?.filter(
        (comment) => comment.toString() !== commentId,
      );

      await user.save();
    }

    await Comment.findByIdAndDelete(commentId);

    const allComments = {
      createdComments: user.createdComments,
      receivedComments: user.receivedComments,
    };

    res
      .status(200)
      .json({ allComments, message: "comment is successfully deleted." });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete a comment." });
  }
});

router.get("/comments-stream/:friendId", (req, res) => {
  const { friendId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.friendId = friendId;

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

router.get("/recomments/comments-recomments-stream/:commentId", (req, res) => {
  const { commentId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.comment = commentId;

  commentsSSE.push(res);

  req.on("close", () => {
    commentsSSE = commentsSSE.filter((comment) => comment !== res);
  });
});

module.exports = router;
