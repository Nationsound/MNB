const Post = require('../models/post.schema');
const errorHandler = require('../utils/error');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// helper: upload buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = process.env.CLOUDINARY_FOLDER || 'mnb') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream); 
  });
}

// Create a new post
const createBlog = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  const { title, content, author, categories } = req.body;
  if (!title || !content) {
    return next(errorHandler(400, 'Provide all required fields'));
  }

  // slug
  const slug = title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '-');

  // categories -> array
  const parsedCategories = Array.isArray(categories)
    ? categories
    : typeof categories === 'string'
      ? categories.split(',').map(c => c.trim()).filter(Boolean)
      : [];

  try {
    let imageUrl, imagePublicId;
    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = up.secure_url;
      imagePublicId = up.public_id;
    }

    const newPost = new Post({
      title,
      content,
      author,
      categories: parsedCategories,
      slug,
      userId: req.user.id,
      ...(imageUrl ? { imageUrl, imagePublicId } : {})
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// Update a post
const updateBlog = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, 'Post not found'));

    const updatedData = { ...req.body };

    // categories can be string or array
    if (updatedData.categories && !Array.isArray(updatedData.categories)) {
      updatedData.categories = updatedData.categories.split(',').map(c => c.trim()).filter(Boolean);
    }

    if (req.file) {
      // upload new image
      const up = await uploadBufferToCloudinary(req.file.buffer);
      updatedData.imageUrl = up.secure_url;
      updatedData.imagePublicId = up.public_id;

      // delete old image if exists
      if (post.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(post.imagePublicId, { resource_type: 'image' });
        } catch (e) {
          console.warn('Could not delete old post image:', e.message);
        }
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedPost) return next(errorHandler(404, 'Post not found'));

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// Delete a post (also delete Cloudinary image if present)
const deleteBlog = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, 'Post not found'));

    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId, { resource_type: 'image' });
      } catch (e) {
        console.warn('Could not delete post image from Cloudinary:', e.message);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
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
    if (!post) return next(errorHandler(404, 'Post not found'));
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
