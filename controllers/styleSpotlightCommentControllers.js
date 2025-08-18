const StyleSpotlight = require("../models/styleSpotLightSchema"); 
const StyleSpotlightComment = require("../models/styleSpotlightCommentSchema");

// ➤ Add General Comment (no spotlight required)
const addGeneralComment = async (req, res) => {
  try {
    const { name, email, content, rating } = req.body;

    const comment = new StyleSpotlightComment({
      name,
      email,
      content,
      rating,
      likes: 0,
      dislikes: 0,
      replies: [],
    });

    await comment.save();
    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ➤ Get All General Comments
const getGeneralComments = async (req, res) => {
  try {
    const comments = await StyleSpotlightComment.find().sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ➤ Add Comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params; // use ID instead of slug
    const { name, email, content, rating } = req.body;

    const spotlight = await StyleSpotlight.findById(id);
    if (!spotlight) {
      return res.status(404).json({ message: "Spotlight not found" });
    }

    const comment = new StyleSpotlightComment({
      spotlightId: spotlight._id,
      name,
      email,
      content,
      rating,
    });

    await comment.save();
    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ➤ Get Comments
const getComments = async (req, res) => {
  try {
    const { id } = req.params; // use ID instead of slug
    const spotlight = await StyleSpotlight.findById(id);
    if (!spotlight) {
      return res.status(404).json({ message: "Spotlight not found" });
    }

    const comments = await StyleSpotlightComment.find({ spotlightId: spotlight._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ➤ Like / Dislike
const updateReaction = async (req, res) => {
  try {
    const { id } = req.params; // comment ID
    const { type } = req.body; // "like" or "dislike"

    const comment = await StyleSpotlightComment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (type === "like") {
      comment.likes += 1;
    } else if (type === "dislike") {
      comment.dislikes += 1;
    } else {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    await comment.save();
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ➤ Add Reply
const addReply = async (req, res) => {
  try {
    const { id } = req.params; // parent comment id
    const { name, email, content } = req.body;

    const comment = await StyleSpotlightComment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      name,
      email,
      content,
      likes: 0,
      dislikes: 0,
    };

    comment.replies.push(reply);
    await comment.save();

    return res.status(201).json(comment.replies[comment.replies.length - 1]);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ➤ Like/Dislike Reply
const updateReplyReaction = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { type } = req.body;

    const comment = await StyleSpotlightComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (type === "like") reply.likes += 1;
    else if (type === "dislike") reply.dislikes += 1;
    else return res.status(400).json({ message: "Invalid reaction type" });

    await comment.save();
    return res.status(200).json(reply);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Comment ID is required" });
    }

    const deleted = await StyleSpotlightComment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error); // <-- log actual issue
    res.status(500).json({ error: "Failed to delete comment" });
  }
};


// Delete ALL comments
const deleteAllComments = async (req, res) => {
  try {
    await StyleSpotlightComment.deleteMany({});
    res.status(200).json({ message: "All comments deleted successfully" });
  } catch (error) {
    console.error("Error deleting all comments:", error);
    res.status(500).json({ error: "Failed to delete all comments" });
  }
};


module.exports = {
  addGeneralComment,
  getGeneralComments,
  addComment,
  getComments,
  updateReaction,
  addReply,
  updateReplyReaction,
  deleteComment,
  deleteAllComments,
};
