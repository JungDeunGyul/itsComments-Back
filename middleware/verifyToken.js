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
      return res.send({ result: "fail", message: "The token does not exist." });
    }

    let decodedData;

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
    return res.send({ result: "fail", message: error.message });
  }
};

module.exports = verifyToken;
