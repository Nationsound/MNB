const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: {
    type: String
  },
  text: { 
    type: String, 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // optional
  parentType: { 
    type: String, 
    required: true 
  }, // e.g., 'Song', 'Post', 'Blog'
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true },
  createdAt: { 
    type: Date, 
    default: Date.now
   },
  likes: { 
    type: Number, 
    default: 0 
  },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Comment'
   }] // nested replies
});

module.exports = mongoose.model('Comment', commentSchema);
