const express = require("express");
const { User } = require("../models/User");

const router = express.Router();

router.get("/", async function (req, res, next) {
  const userId = req.query.id;
  const user = await User.findById(userId).populate("friends");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const friends = user.friends;

  res.status(200).send({ friends });
});

router.patch("/addition", async function (req, res, next) {
  const { userId, friendMail } = req.body;
  const user = await User.findById(userId).populate("friends");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const friend = await User.findOne({ email: friendMail });

  if (!friend) {
    return res.status(404).json({ message: "friend not found." });
  }

  const isFriendAlreadyAdded = user.friends.some((includeFriend) =>
    includeFriend._id.equals(friend._id),
  );

  if (isFriendAlreadyAdded) {
    return res.status(400).json({ message: "Friend already exists." });
  }

  if (user.mail === friendMail) {
    return res
      .status(400)
      .json({ message: "You can't add yourself as a friend." });
  }

  user.friends.push(friend);

  await user.save();

  const friends = user.friends;

  res.status(200).send({ friends });
});

router.patch("/delete", async function (req, res, next) {
  const { userId, friendId } = req.body;
  const user = await User.findById(userId).populate("friends");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.friends = user.friends.filter(
    (friend) => friend._id.toString() !== friendId,
  );

  await user.save();

  const friends = user.friends;

  res.status(200).send({ friends });
});

module.exports = router;
