require("dotenv").config();
require("./loaders/mongoose");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
<<<<<<< HEAD
const profileRouter = require("./routes/profile");
=======
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.EXTENSION_URL,
      process.env.SECOND_EXTENSION_URL,
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
  }),
);

app.use("/", indexRouter);
app.use("/login", loginRouter);
<<<<<<< HEAD
app.use("/profile", profileRouter);
=======
>>>>>>> 58e3390 (feat: create login router and verifyToken middleware and add cors)

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
