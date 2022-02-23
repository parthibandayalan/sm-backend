const app = require("./app.js");
const db = require("./db/index.js");
const SeedPost = require("./seed/postSeed");
const SeedUsers = require("./seed/userSeed");
const PORT = process.env.PORT || 5000;

db.connect().then(() => {
  console.log("Connected to DB ...");
  SeedUsers().then(() =>
    SeedPost().then(() =>
      app.listen(PORT, () => {
        console.log("Listening on port : " + PORT);
      })
    )
  );
});
