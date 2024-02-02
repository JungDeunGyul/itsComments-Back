const express = require("express");
const router = express.Router();
const { User } = require("../Models/User");

router.patch("/user", (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

module.exports = router;
