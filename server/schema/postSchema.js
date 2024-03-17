const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caption: String,
  image: {
    type: String, // Url or reference
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid url for profile picture");
      }
    },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
