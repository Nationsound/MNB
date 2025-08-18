const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    content: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    spotlightId: { type: mongoose.Schema.Types.ObjectId, ref: "StyleSpotlight" },
    name: String,
    email: String,
    content: String,
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: [replySchema], // ✅ nested replies
  },
  { timestamps: true }
);

module.exports = mongoose.model("StyleSpotlightComment", commentSchema);
