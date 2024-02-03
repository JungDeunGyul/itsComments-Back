const express = require("express");
const router = express.Router();

const { User } = require("../Models/User");
const verifyToken = require("../middleware/verifyToken");
const isValidGoogleProfileImageUrl = require("../utiles/imageUtile");

router.patch("/user", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const iCon = req.body.icon;

    if (isValidGoogleProfileImageUrl(iCon)) {
      user.icon = iCon;
    } else if (iCon.endsWith(".png")) {
      user.icon = iCon;
    } else {
      return res.status(400).json({ message: "Invalid image format." });
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
