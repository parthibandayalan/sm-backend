const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  // const token = req.header("auth-token");
  const token = String(req.cookies.JWT_TOKEN).substring(7);

  // console.log("Received header : " + token);
  if (!token) return res.status(401).send("Access Denied");

  try {
    // const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    // req.user = verified;
    // next();
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decodedToken) {
      if (err) {
        throw "Invalid Token";
      } else {
        // console.log(JSON.stringify(decodedToken));
        req.username = decodedToken.username; // Add to req object
        // console.log("req userId : " + req.root);
        next();
      }
    });
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
