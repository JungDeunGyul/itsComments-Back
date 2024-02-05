const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

async function expressLoader(app) {
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
}

module.exports = expressLoader;
