const indexRouter = require("../routes/index");
const loginRouter = require("../routes/login");
const profileRouter = require("../routes/profile");
const commentsRouter = require("../routes/comments");
const locationRouter = require("../routes/location");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/login", loginRouter);
  app.use("/profile", profileRouter);
  app.use("/comments", commentsRouter);
  app.use("/location", locationRouter);
}

module.exports = routerLoader;
