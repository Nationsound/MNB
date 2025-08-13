const Song = require('../models/songSchema.js'); // import your Song model

// Add a comment directly to Song.comments (by slug)
const createComment = async (req, res) => {
  try {
    const { text, username } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Missing text' });
    }

    const comment = { 
      text, 
      username: username || "Anonymous", 
      createdAt: new Date() 
    };

    // Find song by slug and push comment
    const updatedSong = await Song.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { comments: comment } },
      { new: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all comments from Song.comments (by slug)
const getCommentsByParent = async (req, res) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Return comments sorted by newest first
    const comments = song.comments.sort((a, b) => b.createdAt - a.createdAt);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment by index (by slug)
const deleteComment = async (req, res) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    song.comments = song.comments.filter(
      (c, idx) => idx !== parseInt(req.params.commentIdx)
    );
    await song.save();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Like a song (by slug)
const likeSong = async (req, res) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });
    if (!song) return res.status(404).json({ message: 'Song not found' });

    song.likes += 1;
    await song.save();

    res.json(song);
  } catch (error) {
    console.error('Error liking song:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByParent,
  deleteComment,
  likeSong
};
