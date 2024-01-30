const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
generateToken = () => {
  const payload = { user: "kartik" };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
module.exports = { generateToken };
