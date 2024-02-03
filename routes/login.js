const express = require("express");
const router = express.Router();

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
        icon: userData.photoURL,
      });
    }

    res.send({ result: "success" });
  } catch (error) {
    return res.send({ result: "fail", message: "Login failed" });
  }
});

module.exports = router;
