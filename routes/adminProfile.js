const express = require("express");
const router = express.Router();

const { User } = require("../Models/User");
const verifyToken = require("../middleware/verifyToken");

router.patch("/user", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.icon = req.body.icon || user.icon;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
