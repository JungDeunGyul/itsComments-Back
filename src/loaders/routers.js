const indexRouter = require("../routes/index");
const loginRouter = require("../routes/login");
const profileRouter = require("../routes/profile");
const commentRouter = require("../routes/comment");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/login", loginRouter);
  app.use("/profile", profileRouter);
  app.use("/comments", commentRouter);
}

module.exports = routerLoader;
