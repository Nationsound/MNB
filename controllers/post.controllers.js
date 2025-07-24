const Post = require('../models/post.schema');
const errorHandler = require('../utils/error');

// Create a new post
const createBlog = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  const { title, content, author, categories } = req.body;
  if (!title || !content) {
    return next(errorHandler(400, 'Provide all required fields'));
  }

  // Generate slug from title
  const slug = title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '-');

  // Always store categories as array
  const parsedCategories = Array.isArray(categories)
    ? categories
    : typeof categories === 'string'
      ? categories.split(',').map(c => c.trim()).filter(Boolean)
      : [];

  const newPost = new Post({
    title,
    content,
    author,
    categories: parsedCategories,
    slug,
    userId: req.user.id, // or req.user.id if you store the user's _id
    image: req.file ? req.file.filename : null
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost); 
  } catch (error) {
    next(error);
  }
};



// Update a post
const updateBlog = async (req, res, next) => {
  try {
    const updatedData = { ...req.body };

    // If new image uploaded
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    if (updatedData.categories) {
      updatedData.categories = updatedData.categories.split(',').map(c => c.trim());
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedPost) {
      return next(errorHandler(404, 'Post not found'));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// Delete a post
const deleteBlog = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return next(errorHandler(404, 'Post not found'));
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all posts
const getAllBlogs = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// Get single post
const getBlogById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
};
