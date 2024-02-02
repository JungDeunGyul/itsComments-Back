const express = require("express");
const router = express.Router();

const { User } = require("../Models/User");
const verifyToken = require("../middleware/verifyToken");

router.patch("/user", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
