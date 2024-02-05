const express = require("express");

const router = express.Router();

<<<<<<< HEAD
const { User } = require("../Models/User");

<<<<<<< HEAD
=======
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)
router.post("/", async (req, res, next) => {
=======
router.post("/", async (req, res) => {
>>>>>>> 32bfb0b (style:Standardize response format to use JSON)
  try {
    const userData = req.body.user;

    res.cookie("accessToken", userData.stsTokenManager.accessToken);
    res.cookie("refreshToken", userData.stsTokenManager.refreshToken);

    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = await User.create({
        email: userData.email,
        nickname: userData.displayName,
<<<<<<< HEAD
<<<<<<< HEAD
        icon: userData.photoURL,
=======
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)
=======
        icon: userData.photoURL,
>>>>>>> 501e5a6 (fix: login roter user.icon)
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: "Login failed." });
  }
});

module.exports = router;
