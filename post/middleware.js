const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("dotenv").config({ path: "./config.env" });

const secretKey = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  validateToken,
};
