const SmartLink = require('../models/smartLink.schema.js')

// Create new smart link
const createSmartLink = async (req, res) => {
  try {
    const { title, youtube, spotify, boomplay, appleMusic, audiomack } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    const newLink = new SmartLink({
      title,
      coverImage,
      youtube,
      spotify,
      boomplay,
      appleMusic,
      audiomack
    });

    const saved = await newLink.save();
    res.status(201).json({ id: saved._id, message: 'Smart link created successfully' });
  } catch (error) {
    console.error('Error creating smart link:', error);
    res.status(500).json({ message: 'Failed to create smart link' });
  }
};



// Get smart link by ID
const getSmartLinkById = async (req, res) => {
  try {
    const link = await SmartLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: 'Smart link not found' });
    }
    res.json(link);
  } catch (error) {
    console.error('Error fetching smart link:', error);
    res.status(500).json({ message: 'Failed to fetch smart link' });
  }
};


module.exports = {
  createSmartLink,
  getSmartLinkById,
};
