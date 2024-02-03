const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { User } = require("../Models/User");

=======
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)
router.post("/", async (req, res, next) => {
  try {
    const userData = req.body.user;

    res.cookie("accessToken", userData.stsTokenManager.accessToken);
    res.cookie("refreshToken", userData.stsTokenManager.refreshToken);

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      User.create({
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

    res.send({ result: "success" });
  } catch (error) {
    return res.send({ result: "fail", message: "Login failed" });
  }
});

module.exports = router;
