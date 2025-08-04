const Advert = require('../models/advertSchema');

// Create new advert
const createAdvert = async (req, res) => {
  try {
    const advertData = req.body;
    if (req.file) {
      advertData.imageUrl = req.file.filename; // or req.file.path if you keep full path
    }
    const newAdvert = await Advert.create(advertData);
    res.status(201).json(newAdvert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all adverts
const getAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find();
    res.status(200).json(adverts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single advert by ID
const getAdvertById = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) return res.status(404).json({ message: 'Advert not found' });
    res.status(200).json(advert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update advert by ID
const updateAdvert = async (req, res) => {
  try {
    const advertData = req.body;
    if (req.file) {
      advertData.imageUrl = req.file.filename;
    }
    const updatedAdvert = await Advert.findByIdAndUpdate(
      req.params.id,
      advertData,
      { new: true }
    );
    if (!updatedAdvert) return res.status(404).json({ message: 'Advert not found' });
    res.status(200).json(updatedAdvert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete advert by ID
const deleteAdvert = async (req, res) => {
  try {
    const deletedAdvert = await Advert.findByIdAndDelete(req.params.id);
    if (!deletedAdvert) return res.status(404).json({ message: 'Advert not found' });
    res.status(200).json({ message: 'Advert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdvert,
  getAdverts,
  getAdvertById,
  updateAdvert,
  deleteAdvert
};
