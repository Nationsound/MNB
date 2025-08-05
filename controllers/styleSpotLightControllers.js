const StyleSpotlight = require('../models/styleSpotLightSchema');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Upload image to Cloudinary using stream
const uploadToCloudinary = (buffer, folder = 'spotlights') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Get all spotlights
const getAllSpotlights = async (req, res) => {
  try {
    const spotlights = await StyleSpotlight.find().sort({ createdAt: -1 });
    res.json(spotlights);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch spotlights' });
  }
};

// Add new spotlight
const addSpotlight = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'spotlights');

    const newSpotlight = new StyleSpotlight({
      name,
      description,
      category,
      image: result.secure_url,
      imageId: result.public_id,
      featured: false
    });

    await newSpotlight.save();
    res.status(201).json(newSpotlight);
  } catch (error) {
    console.error('Add error:', error);
    res.status(500).json({ message: 'Failed to add spotlight' });
  }
};

// Update spotlight
const updateSpotlight = async (req, res) => {
  try {
    const { name, description, category, featured } = req.body;
    const spotlight = await StyleSpotlight.findById(req.params.id);
    if (!spotlight) {
      return res.status(404).json({ message: 'Spotlight not found' });
    }

    // If new image uploaded, replace old one
    if (req.file) {
      if (spotlight.imageId) {
        await cloudinary.uploader.destroy(spotlight.imageId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'spotlights');
      spotlight.image = result.secure_url;
      spotlight.imageId = result.public_id;
    }

    spotlight.name = name || spotlight.name;
    spotlight.description = description || spotlight.description;
    spotlight.category = category || spotlight.category;
    spotlight.featured = featured ?? spotlight.featured;

    const updated = await spotlight.save();
    res.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update spotlight' });
  }
};

// Delete spotlight
const deleteSpotlight = async (req, res) => {
  try {
    const spotlight = await StyleSpotlight.findById(req.params.id);
    if (!spotlight) {
      return res.status(404).json({ message: 'Spotlight not found' });
    }

    // Delete image from Cloudinary if exists
    if (spotlight.imageId) {
      await cloudinary.uploader.destroy(spotlight.imageId);
    }

    await spotlight.deleteOne();
    res.json({ message: 'Spotlight deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete spotlight' });
  }
};

module.exports = {
  getAllSpotlights,
  addSpotlight,
  updateSpotlight,
  deleteSpotlight
};
