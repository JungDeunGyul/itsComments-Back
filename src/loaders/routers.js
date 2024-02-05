const indexRouter = require("../routes/index");
const loginRouter = require("../routes/login");
const profileRouter = require("../routes/profile");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/login", loginRouter);
  app.use("/profile", profileRouter);
}

module.exports = routerLoader;
