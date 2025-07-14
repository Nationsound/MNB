const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    title: {
      type: String, 
      required: true,
      unique: true
    },
    image: {
      type: String,
      default: "https://your-default-image-url-here.com"
    },
    category: {
      type: String,
      default: "Uncategorize"
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    likes: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
