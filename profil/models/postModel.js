const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  bio: String,
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
