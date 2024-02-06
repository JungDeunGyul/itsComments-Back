const indexRouter = require("../routes/index");
const loginRouter = require("../routes/login");
const profileRouter = require("../routes/profile");
const commentsRouter = require("../routes/comments");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/login", loginRouter);
  app.use("/profile", profileRouter);
  app.use("/comments", commentsRouter);
}

module.exports = routerLoader;
