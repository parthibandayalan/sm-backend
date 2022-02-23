const express = require("express");
const router = express.Router();
const User = require("../db/models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users));
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:username", async (req, res) => {
  try {
    console.log("get user using username");
    const users = await User.find({ username: req.params.username }).exec();
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users[0]));
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const u1 = await user.save();
    res.json(u1);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.patch("/:username", async (req, res) => {
  try {
    const entries = Object.keys(req.body);
    const updates = {};

    // constructing dynamic query
    for (let i = 0; i < entries.length; i++) {
      if (entries[i] != "username") {
        updates[entries[i]] = Object.values(req.body)[i];
      } else {
        throw "Username cannot be changed";
      }
    }

    const users = await User.find({ username: req.params.username }).exec();

    let searchId = users[0].id;
    console.table(searchId);
    console.log(updates);

    User.findByIdAndUpdate(
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
              msg: "Update Success",
            })
          );
        }
      }
    );
  } catch (err) {
    console.log("Error Occured" + err);
    res.status = 400;
    res.send(err);
  }
});

router.delete("/:username", async (req, res) => {
  try {
    // const users = await User.find({ username: req.params.username }).exec();
    // await User.find({ username: req.params.username }, function (err, users) {
    //   try {
    //     if (err) throw err;
    //     if (users.length != 1) throw "User not found";
    //     const user = new User(users[0]);
    //     user.delete();
    //     res.setHeader("Content-Type", "application/json");
    //     res.end(JSON.stringify(user));
    //   } catch (err) {
    //     res.send("Error " + err);
    //   }
    // });
    console.log("deletion started");
    const user = await User.findOne({ username: req.params.username });
    if (user == null) throw "User not found";
    user.remove();
    console.log("deletion done!!");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(user));
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
