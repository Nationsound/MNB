const Admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary'); // <- make sure path is correct
const streamifier = require('streamifier');

// helper: upload a buffer to cloudinary
function uploadBufferToCloudinary(buffer, folder = process.env.CLOUDINARY_FOLDER || 'mnb') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create new admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // optional image upload
    let imageUrl, imagePublicId;
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      ...(imageUrl ? { imageUrl, imagePublicId } : {})
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin', error: error.message });
  }
};

// Update admin by ID
const updateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // build update fields
    const updateData = {
      name: name ?? admin.name,
      email: email ?? admin.email,
    };

    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // if new image uploaded -> upload to cloudinary, then delete old one
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);

      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;

      if (admin.imagePublicId) {
        // best-effort deletion; not fatal if it fails
        try {
          await cloudinary.uploader.destroy(admin.imagePublicId, { resource_type: 'image' });
        } catch (e) {
          console.warn('Could not delete old admin image:', e.message);
        }
      }
    }

    const updated = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true, select: '-password' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // delete image from cloudinary if present
    if (admin.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(admin.imagePublicId, { resource_type: 'image' });
      } catch (e) {
        console.warn('Could not delete admin image from Cloudinary:', e.message);
      }
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};

// Admin login (using email)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: admin._id, email: admin.email, isAdmin: true };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '2h' });

    res.json({ token, admin: { ...admin.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  adminLogin,
};
