const Artist = require('../models/artistSchema');
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

// @desc Add new artist
// @route POST /api/artists
const createArtist = async (req, res) => {
  try {
    const { name, genre } = req.body;
    const doc = { name, genre };

    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      doc.imageUrl = up.secure_url;
      doc.imagePublicId = up.public_id;
    }

    const newArtist = await Artist.create(doc);
    res.status(201).json({ message: 'Artist uploaded successfully!', artist: newArtist });
  } catch (error) {
    console.error('Error uploading artist:', error);
    res.status(500).json({ message: 'Server error while uploading artist.' });
  }
};

// @desc Get all artists
// @route GET /api/artists
const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Server error while fetching artists.' });
  }
};

// @desc Delete artist by ID
// @route DELETE /api/artists/:id
const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found.' });

    // best-effort delete image from Cloudinary
    if (artist.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(artist.imagePublicId, { resource_type: 'image' });
      } catch (e) {
        console.warn('Could not delete artist image from Cloudinary:', e.message);
      }
    }

    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artist deleted successfully.', artist });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ message: 'Server error while deleting artist.' });
  }
};

// @desc Update artist by ID
// @route PUT /api/artists/:id
const updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found.' });

    const { name, genre } = req.body;
    const updatedData = {
      name: name ?? artist.name,
      genre: genre ?? artist.genre,
    };

    if (req.file) {
      // upload new image
      const up = await uploadBufferToCloudinary(req.file.buffer);
      updatedData.imageUrl = up.secure_url;
      updatedData.imagePublicId = up.public_id;

      // delete old if exists
      if (artist.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(artist.imagePublicId, { resource_type: 'image' });
        } catch (e) {
          console.warn('Could not delete old artist image:', e.message);
        }
      }
    }

    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: 'Artist updated successfully.', artist: updatedArtist });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ message: 'Server error while updating artist.' });
  }
};

module.exports = {
  createArtist,
  getAllArtists,
  deleteArtist,
  updateArtist
};
