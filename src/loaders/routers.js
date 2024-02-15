const indexRouter = require("../routes/index");
const loginRouter = require("../routes/login");
const profileRouter = require("../routes/profile");
const commentsRouter = require("../routes/comments");
const locationRouter = require("../routes/location");
const friendsRouter = require("../routes/friends");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/login", loginRouter);
  app.use("/profile", profileRouter);
  app.use("/comments", commentsRouter);
  app.use("/location", locationRouter);
  app.use("/friends", friendsRouter);
}

module.exports = routerLoader;
