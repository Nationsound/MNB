const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controllers.js');
const { verifyToken } = require('../utils/verifyUser');
const upload = require('../multer.js');

// Create new post
router.post('/mnb/api/addPost', verifyToken, upload.single('image'), postController.createBlog);

// Update existing post
router.put('/mnb/api/updatePost/:id', verifyToken, upload.single('image'), postController.updateBlog);

// Delete post
router.delete('/mnb/api/deletePost/:id', verifyToken, postController.deleteBlog);

// Get all posts
router.get('/mnb/api/getAllPosts', postController.getAllBlogs);

// Get single post by id
router.get('/mnb/api/getPost/:id', postController.getBlogById);

module.exports = router;
