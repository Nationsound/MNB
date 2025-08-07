const SmartLink = require('../models/smartLink.schema');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const slugify = require('slugify');

// Helper: Upload buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = process.env.CLOUDINARY_FOLDER || 'mnb') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ✅ Create new smart link (with slug + Cloudinary image)
const createSmartLink = async (req, res) => {
  try {
    const { songTitle, artistName, youtube, spotify, boomplay, appleMusic, audiomack } = req.body;

    const slug = slugify(songTitle, { lower: true, strict: true });

    // Check for duplicates
    const existing = await SmartLink.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Smart link with this title already exists' });
    }

    let coverImageUrl, coverImagePublicId;
    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      coverImageUrl = up.secure_url;
      coverImagePublicId = up.public_id;
    }

    const newLink = await SmartLink.create({
      songTitle,
      artistName,
      slug,
      youtube,
      spotify,
      boomplay,
      appleMusic,
      audiomack,
      ...(coverImageUrl ? { coverImageUrl, coverImagePublicId } : {}),
    });

    res.status(201).json({
      slug: newLink.slug,
      message: 'Smart link created successfully',
    });
  } catch (error) {
    console.error('Error creating smart link:', error);
    res.status(500).json({
      message: 'Failed to create smart link',
      error: error.message,
    });
  }
};

// ✅ Get smart link by slug
const getSmartLinkBySlug = async (req, res) => {
  try {
    const link = await SmartLink.findOne({ slug: req.params.slug });
    if (!link) {
      return res.status(404).json({ message: 'Smart link not found' });
    }
    res.json(link);
  } catch (error) {
    console.error('Error fetching smart link:', error);
    res.status(500).json({
      message: 'Failed to fetch smart link',
      error: error.message,
    });
  }
};

module.exports = {
  createSmartLink,
  getSmartLinkBySlug,
};
