const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  password: {
    type: String,
    required: [true, "A user must need to provide the password"],
  },
});
//middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// instance method
userSchema.methods.correctPassword = async function (canpass, userpass) {
  return await bcrypt.compare(canpass, userpass);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
