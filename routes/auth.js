const router = require("express").Router();
const User = require("../db/models/user");
const {
  registerValidation,
  loginValidation,
} = require("../db/models/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../routes/verifyToken");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  // console.log("Registration Started : ");
  // console.log(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("Username already Exists");

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    username: req.body.username,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //lets validate

  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Checking if the user exists in the database
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username doesnt exists");

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) return res.status(400).send("Invalid Password");

  //create and assign a token
  const token =
    "Bearer " +
    jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET);
  //res.header("auth-token", token);

  //generate token and send it
  //res.cookie([ JWT_TOKEN=Bearer ${token}; secure; httponly; samesite=Strict;, ])
  res
    .status(200)
    .cookie("JWT_TOKEN", token, {
      path: "/",
      expires: new Date(new Date().getTime() + 1000 * 1000),
      httpOnly: true,
    })
    .send({ username: user.username, name: user.name });
});

router.post("/refresh", verify, async (req, res) => {
  try {
    console.log("Refresh token");
    const user = await User.findOne({ username: req.username });
    if (!user) return res.status(400).send("Username doesnt exists");
    const token =
      "Bearer " +
      jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET);
    res
      .status(200)
      .cookie("JWT_TOKEN", token, {
        path: "/",
        expires: new Date(new Date().getTime() + 1000 * 1000),
        httpOnly: true,
      })
      .send({ username: user.username, name: user.name });
  } catch (err) {
    console.log(err);
  }
});

router.post("/cancel", verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username });
    if (!user) return res.status(400).send("Username doesnt exists");
    console.log("Cancel token");
    const token =
      "Bearer " +
      jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET);
    res
      .status(200)
      .cookie("JWT_TOKEN", token, {
        path: "/",
        expires: new Date(new Date().getTime()),
        httpOnly: true,
      })
      .send({ username: user.username, name: user.name });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
