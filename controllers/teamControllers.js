const TeamMember = require('../models/teamSchema');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Upload helper
const uploadToCloudinary = (buffer, folder = 'team') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Create
const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, quote, linkedin, twitter, instagram } = req.body;

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'team');
      imageUrl = result.secure_url;
    }

    const member = new TeamMember({
      name,
      role,
      quote,
      linkedin,
      twitter,
      instagram,
      image: imageUrl
    });

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

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'team');
      updates.image = result.secure_url;
    }

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
