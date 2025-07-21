const StyleSpotlight = require('../models/styleSpotLightSchema');

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

// Add a new nomination
const addSpotlight = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newSpotlight = new StyleSpotlight({
      name,
      description,
      category,
      image,
      featured: false
    });

    await newSpotlight.save();
    res.status(201).json(newSpotlight);
  } catch (error) {
    console.error('Add error:', error);
    res.status(500).json({ message: 'Failed to add spotlight' });
  }
};

module.exports = { 
    getAllSpotlights, 
    addSpotlight 
};
