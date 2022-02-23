const mongoose = require("mongoose");
const Post = require("../models/post");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("remove", async function (next, user) {
  console.log("Removing Users" + user);
  next();
});

UserSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
