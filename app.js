const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// const { MongoClient } = require("mongodb");
require("dotenv/config");

const app = express();

//use json parser middleware
app.use(express.json());
app.use(cookieParser());

//middleware to add Cors headers
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  // next();
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

//Routes
const postRouter = require("./routes/posts");
app.use("/posts", postRouter);
const userRouter = require("./routes/users");
app.use("/user", userRouter);
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);
const imageRouter = require("./routes/image");
app.use("/image", imageRouter);

app.get("/", (req, res) => {
  res.send("we are on home");
});

module.exports = app;
