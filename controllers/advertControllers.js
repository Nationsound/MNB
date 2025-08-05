const Advert = require('../models/advertSchema');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// helper: upload a buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = process.env.CLOUDINARY_FOLDER || 'mnb') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create new advert
const createAdvert = async (req, res) => {
  try {
    const advertData = { ...req.body };

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      advertData.imageUrl = uploaded.secure_url;
      advertData.imagePublicId = uploaded.public_id;
    }

    const newAdvert = await Advert.create(advertData);
    res.status(201).json(newAdvert);
  } catch (error) {
    res.status(400).json({ message: 'Error creating advert', error: error.message });
  }
};

// Get all adverts
const getAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find();
    res.status(200).json(adverts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adverts', error: error.message });
  }
};

// Get single advert by ID
const getAdvertById = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) return res.status(404).json({ message: 'Advert not found' });
    res.status(200).json(advert);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advert', error: error.message });
  }
};

// Update advert by ID
const updateAdvert = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) return res.status(404).json({ message: 'Advert not found' });

    const advertData = { ...req.body };

    if (req.file) {
      // upload new image
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      advertData.imageUrl = uploaded.secure_url;
      advertData.imagePublicId = uploaded.public_id;

      // best-effort delete of old image
      if (advert.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(advert.imagePublicId, { resource_type: 'image' });
        } catch (e) {
          console.warn('Could not delete old advert image:', e.message);
        }
      }
    }

    const updatedAdvert = await Advert.findByIdAndUpdate(req.params.id, advertData, { new: true });
    res.status(200).json(updatedAdvert);
  } catch (error) {
    res.status(400).json({ message: 'Error updating advert', error: error.message });
  }
};

// Delete advert by ID
const deleteAdvert = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) return res.status(404).json({ message: 'Advert not found' });

    // delete image in Cloudinary if present
    if (advert.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(advert.imagePublicId, { resource_type: 'image' });
      } catch (e) {
        console.warn('Could not delete advert image from Cloudinary:', e.message);
      }
    }

    await Advert.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Advert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting advert', error: error.message });
  }
};

module.exports = {
  createAdvert,
  getAdverts,
  getAdvertById,
  updateAdvert,
  deleteAdvert
};
