const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controllers.js');

// Add comment
router.post('/mnb/api/addComment/:parentId', commentController.createComment);

// Get comments for a parent (now only need parentId since parentType is always 'Song')
router.get('/mnb/api/comments/:parentId', commentController.getCommentsByParent);

// Delete comment by index (since comments are in Song.comments array)
router.delete('/mnb/api/deleteComment/:parentId/:commentIdx', commentController.deleteComment);

// Like the song
router.patch('/mnb/api/likeSong/:parentId', commentController.likeSong);


module.exports = router;
