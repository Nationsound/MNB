const Artist = require('../models/artistSchema');

// @desc Add new artist
// @route POST /api/artists
const createArtist = async (req, res) => {
  try {
    const { name, genre } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newArtist = new Artist({ name, genre, imageUrl });
    await newArtist.save();

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
    const deletedArtist = await Artist.findByIdAndDelete(req.params.id);

    if (!deletedArtist) {
      return res.status(404).json({ message: 'Artist not found.' });
    }

    res.json({ message: 'Artist deleted successfully.', artist: deletedArtist });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ message: 'Server error while deleting artist.' });
  }
};

// @desc Update artist by ID
// @route PUT /api/artists/:id
const updateArtist = async (req, res) => {
  try {
    const { name, genre } = req.body;
    const updatedData = { name, genre };

    if (req.file) {
      updatedData.imageUrl = req.file.path;
    }

    const updatedArtist = await Artist.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedArtist) {
      return res.status(404).json({ message: 'Artist not found.' });
    }

    res.json({ message: 'Artist updated successfully.', artist: updatedArtist });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ message: 'Server error while updating artist.' });
  }
};

// export all controllers
module.exports = {
  createArtist,
  getAllArtists,
  deleteArtist,
  updateArtist
};
