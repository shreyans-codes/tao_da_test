const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.SESSION_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
