const TeamMember = require('../models/teamSchema');
// Create
const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, quote, linkedin, twitter, instagram } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const member = new TeamMember({ name, role, quote, linkedin, twitter, instagram, image });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

// Get all with pagination & search
const getTeamMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const members = await TeamMember.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await TeamMember.countDocuments(query);
    res.json({ total, members });
  } catch (err) {
    next(err);
  }
};

// Get single by ID
const getTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

// Update
const updateTeamMember = async (req, res, next) => {
  try {
    const { name, role, quote, linkedin, twitter, instagram } = req.body;
    const updates = { name, role, quote, linkedin, twitter, instagram };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    const member = await TeamMember.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

// Delete
const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember
};