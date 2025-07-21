const Partnership = require('../models/partnershipSchema');

// Create new partnership
const createPartnership = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newPartnership = await Partnership.create({ name, email, message });
    res.status(201).json(newPartnership);
  } catch (error) {
    console.error('Error creating partnership:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single partnership by ID
const getPartnership = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }
    res.status(200).json(partnership);
  } catch (error) {
    console.error('Error fetching partnership:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all partnerships
const getAllPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.find().sort({ createdAt: -1 });
    res.status(200).json(partnerships);
  } catch (error) {
    console.error('Error fetching partnerships:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update partnership by ID
const updatePartnership = async (req, res) => {
  try {
    const updated = await Partnership.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Partnership not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating partnership:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete partnership by ID
const deletePartnership = async (req, res) => {
  try {
    const deleted = await Partnership.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Partnership not found' });
    }
    res.status(200).json({ message: 'Partnership deleted successfully' });
  } catch (error) {
    console.error('Error deleting partnership:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createPartnership,
  getPartnership,
  getAllPartnerships,
  updatePartnership,
  deletePartnership
};
