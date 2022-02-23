const express = require("express");
const router = express.Router();
const Post = require("../db/models/post");
const User = require("../db/models/user");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
const verify = require("../routes/verifyToken");

router.get("/", verify, async (req, res) => {
  try {
    const posts = await Post.find();
    const outputPosts = [];
    // posts.forEach(async eachPost => {
    //   const user = await User.findById(eachPost._id);
    //   eachPost.username = user.username;
    //   eachPost.name = user.name;
    // });
    for (const post of posts) {
      const postDoc = post._doc;
      // console.log("Posted By id :" + post.postedBy);
      const user = await User.findById(post.postedBy);
      // console.log(JSON.stringify(user));
      outputPosts.push({
        ...postDoc,
        username: user.username,
        name: user.name,
      });
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(outputPosts));
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:username", verify, async (req, res) => {
  try {
    console.log("get /:username Username : " + req.params.username);
    const users = await User.find({ username: req.params.username }).exec();
    if (users.length < 1) {
      throw "user not found";
    }
    const posts = await Post.find({ postedBy: users[0]._id }).exec();
    const outputPosts = [];
    for (const post of posts) {
      const postDoc = post._doc;
      outputPosts.push({
        ...postDoc,
        username: users[0].username,
        name: users[0].name,
      });
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(outputPosts));
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", verify, async (req, res) => {
  console.log("Inside post route");

  const post = new Post({
    title: req.body.title,
    message: req.body.message,
  });

  try {
    const users = await User.find({ username: req.body.username }).exec();
    console.log(JSON.stringify(users));
    if (users.length != 1) throw "user not found";
    post.postedBy = users[0]._id;
    // console.log(users);
    const p1 = await post.save();
    res.json(p1);
  } catch (err) {
    res.send(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const entries = Object.keys(req.body);
    const updates = {};

    // constructing dynamic query
    for (let i = 0; i < entries.length; i++) {
      updates[entries[i]] = Object.values(req.body)[i];
    }

    let searchId = req.params.id;
    // console.table(searchId);
    // console.log(updates);

    Post.findByIdAndUpdate(
      searchId,
      {
        $set: updates,
      },
      function (err, success) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              msg: "update success",
            })
          );
        }
      }
    );
  } catch (err) {
    res.send("Error");
  }
});

router.delete("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(post.postedBy);
    console.log("request id : " + req.params.id);
    // console.log(user.username);
    if (user.username == req.username) {
      // await Post.deleteOne({ _id: id });
      await post.delete();
    } else {
      throw "invalid username";
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(post));
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
