const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const s3Uploader = require("../middleware/s3Uploader");

router.patch("/", s3Uploader.single("profileIcon"), async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId)
      .populate("friends")
      .populate({
        path: "feedComments",
        populate: {
          path: "creator",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const iconKey = req.file.key;
    const profileIcon = `${process.env.CLOUD_FROUNT}/${iconKey}`;

    user.icon = profileIcon;

    await user.save();

    console.log(user.icon);
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    res.status(400).json({ message: "Profile update failed" });
=======
    next(error);
>>>>>>> c2788d5 (style:parmeter value intuitive)
=======
=======
    console.log(error);
>>>>>>> a36b0c2 (feat: Implement endpoint for profile updates)
    res.status(400).json({ message: "Profile updated failed" });
>>>>>>> 51990ae (refactor:changed error handling)
  }
});

module.exports = router;
