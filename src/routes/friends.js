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
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const friend = await User.findOne({ email: friendMail });

  if (!friend) {
    return res.status(404).json({ message: "friend not found." });
  }

  user.friends.push(friend);

  await user.save();

  const friends = user.friends;

  res.status(200).send({ friends });
});

module.exports = router;
