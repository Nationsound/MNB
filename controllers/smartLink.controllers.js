const SmartLink = require('../models/smartLink.schema.js');
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

// Create new smart link
const createSmartLink = async (req, res) => {
  try {
    const { title, youtube, spotify, boomplay, appleMusic, audiomack } = req.body;

    let coverImageUrl, coverImagePublicId;
    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      coverImageUrl = up.secure_url;
      coverImagePublicId = up.public_id;
    }

    const newLink = await SmartLink.create({
      title,
      youtube,
      spotify,
      boomplay,
      appleMusic,
      audiomack,
      ...(coverImageUrl ? { coverImageUrl, coverImagePublicId } : {})
    });

    res.status(201).json({ id: newLink._id, message: 'Smart link created successfully' });
  } catch (error) {
    console.error('Error creating smart link:', error);
    res.status(500).json({ message: 'Failed to create smart link', error: error.message });
  }
};

// Get smart link by ID
const getSmartLinkById = async (req, res) => {
  try {
    const link = await SmartLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Smart link not found' });
    res.json(link);
  } catch (error) {
    console.error('Error fetching smart link:', error);
    res.status(500).json({ message: 'Failed to fetch smart link', error: error.message });
  }
};

module.exports = {
  createSmartLink,
  getSmartLinkById,
};
