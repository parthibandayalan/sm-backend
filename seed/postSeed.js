const Post = require("../db/models/post");
const User = require("../db/models/user");

async function seedPost() {
  console.log("Seeding Data");
  try {
    const posts = await Post.find();

    // console.log(posts);

    // console.log("Looping Through Each Post");

    // posts.forEach(async element => {
    //   console.log(element._id);
    //   console.log("Each Retreived Item ");
    //   Post.findByIdAndDelete(element._id, function (err) {
    //     if (err) console.log(err);
    //     console.log("Successful deletion");
    //   });
    // });

    for (let eachPost of posts) {
      //   await Post.findByIdAndDelete(eachPost._id, function (err) {
      //     if (err) console.log(err);
      //     else console.log("Successful deletion");
      //   });
      await Post.findByIdAndDelete(eachPost._id);
    }

    console.log("Deletion Completed");

    const listPosts = [
      {
        title: "New Title Seed 1",
        message: "New Message 1 Seed",
        postedBy: "username1",
      },
      {
        title: "New Title Seed 2",
        message: "New Message 2 Seed",
        postedBy: "username2",
      },
      {
        title: "New Title Seed 3",
        message: "New Message 3 Seed",
        postedBy: "username3",
      },
      {
        title: "New Title Seed 5",
        message: "New Message 4 Seed",
        postedBy: "username4",
      },
    ];

    for (let eachPost of listPosts) {
      const post = new Post({
        title: eachPost.title,
        message: eachPost.message,
      });
      const users = await User.find({ username: eachPost.postedBy }).exec();
      if (users.length != 1) throw "user not found";
      post.postedBy = users[0]._id;
      const p1 = await post.save();
    }
    console.log("Insertion Completed");
  } catch (err) {
    console.log(err);
  }
}

module.exports = seedPost;
