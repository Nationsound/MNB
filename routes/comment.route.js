const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controllers.js');

// Add comment
router.post('/mnb/api/addComment/:slug', commentController.createComment);

// Get comments for a song (by slug)
router.get('/mnb/api/comments/:slug', commentController.getCommentsByParent);

// Delete comment by index (by slug)
router.delete('/mnb/api/deleteComment/:slug/:commentIdx', commentController.deleteComment);

// Like the song (by slug)
router.patch('/mnb/api/likeSong/:slug', commentController.likeSong);

module.exports = router;
