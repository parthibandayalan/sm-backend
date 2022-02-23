const User = require("../db/models/user");
const bcrypt = require("bcryptjs");

async function seedUsers() {
  console.log("Seeding Data For Users");
  try {
    const users = await User.find();

    //Loop through all user entries and delete them
    for (let eachUser of users) {
      await User.findByIdAndDelete(eachUser._id);
    }

    console.log("Deletion Completed");

    const listUsers = [
      {
        name: "firstname lastname",
        username: "username1",
        password: "Password123",
      },
      {
        name: "firstname lastname",
        username: "username2",
        password: "Password123",
      },
      {
        name: "firstname lastname",
        username: "username3",
        password: "Password123",
      },
      {
        name: "firstname lastname",
        username: "username4",
        password: "Password123",
      },
    ];

    for (let eachUser of listUsers) {
      //Hash the password
      const salt = await bcrypt.genSalt(10);
      eachUser.password = await bcrypt.hash(eachUser.password, salt);

      await new User(eachUser).save();
    }
    console.log("Insertion Completed");
  } catch (err) {
    console.log(err);
  }
}

module.exports = seedUsers;
