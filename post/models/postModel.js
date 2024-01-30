const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
});
const Posttt = mongoose.model("Posttt", postSchema);
module.exports = Posttt;
