const admin = require("firebase-admin");

const serviceAccount = require(process.env.GOOGLE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
<<<<<<< HEAD:middleware/verifyToken.js
<<<<<<< HEAD
<<<<<<< HEAD
      return res.send({ result: "fail", message: "The token does not exist." });
=======
      return res.status(400).json({ message: "The token does not exist." });
>>>>>>> d07b407 (refactor: Refactor code structure and directory organization):src/middleware/verifyToken.js
    }

    let decodedData;

<<<<<<< HEAD
    try {
      decodedData = await admin.auth().verifyIdToken(accessToken);
    } catch (error) {
      if (error.code === "auth/id-token-expired") {
        const user = await admin.auth().verifyIdToken(refreshToken);
        const newAccessToken = await user.getIdToken();
        decodedData = await admin.auth().verifyIdToken(newAccessToken);
      } else {
        return res.status(400).json({ message: error.message });
      }
    }

    next();
  } catch (error) {
<<<<<<< HEAD:middleware/verifyToken.js
    return res.send({ result: "fail", message: error.message });
=======
      return res.send({ result: "fail", message: "All tokens have expired." });
=======
      return res.send({ result: "fail", message: "The token does not exist." });
>>>>>>> a9e94e5 (refactor: Modify the verifyToken logic)
    }

    let decodedData;
=======
>>>>>>> 09a6161 (style: Add line spacing)
    try {
      decodedData = await admin.auth().verifyIdToken(accessToken);
    } catch (error) {
      if (error.code === "auth/id-token-expired") {
        const user = await admin.auth().verifyIdToken(refreshToken);
        const newAccessToken = await user.getIdToken();
        decodedData = await admin.auth().verifyIdToken(newAccessToken);
      } else {
        return res.send({ result: "fail", message: error.message });
      }
    }
    next();
  } catch (error) {
<<<<<<< HEAD
    return res.status(401).json({ error: "Unauthorized - Invalid tokens" });
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)
=======
    return res.send({ result: "fail", message: error.message });
>>>>>>> a9e94e5 (refactor: Modify the verifyToken logic)
=======
    return res.status(400).json({ message: error.message });
>>>>>>> d07b407 (refactor: Refactor code structure and directory organization):src/middleware/verifyToken.js
  }
};

module.exports = verifyToken;