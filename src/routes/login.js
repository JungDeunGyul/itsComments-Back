const express = require("express");

const router = express.Router();

<<<<<<< HEAD:routes/login.js
<<<<<<< HEAD
const { User } = require("../Models/User");
=======
const { User } = require("../models/User");
>>>>>>> d07b407 (refactor: Refactor code structure and directory organization):src/routes/login.js

<<<<<<< HEAD
=======
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)
router.post("/", async (req, res, next) => {
=======
router.post("/", async (req, res) => {
>>>>>>> 32bfb0b (style:Standardize response format to use JSON)
  try {
    const userData = req.body.user;

    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = await User.create({
        email: userData.email,
<<<<<<< HEAD:routes/login.js
        nickname: userData.displayName,
<<<<<<< HEAD
<<<<<<< HEAD
=======
        nickname: userData.displayName ? userData.displayName : "Unnamed",
>>>>>>> d07b407 (refactor: Refactor code structure and directory organization):src/routes/login.js
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
