const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const isValidGoogleProfileImageUrl = require("../utiles/imageUtile");

router.patch("/", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user.email });

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
  } catch (error) {
<<<<<<< HEAD
<<<<<<< HEAD
    res.status(400).json({ message: "Profile update failed" });
=======
    next(error);
>>>>>>> c2788d5 (style:parmeter value intuitive)
=======
    res.status(400).json({ message: "Profile updated failed" });
>>>>>>> 51990ae (refactor:changed error handling)
  }
});

module.exports = router;
