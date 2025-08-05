const Song = require('../models/songSchema');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Upload any buffer to Cloudinary
function uploadBufferToCloudinary(buffer, opts = {}) {
  // opts: { folder, resource_type ('image' | 'video' | 'auto') }
  const defaultOpts = { folder: process.env.CLOUDINARY_FOLDER || 'mnb', resource_type: 'auto' };
  const options = { ...defaultOpts, ...opts };
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, res) =>
      err ? reject(err) : resolve(res)
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

const createSong = async (req, res, next) => {
  try {
    const { title, artist, description } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ message: 'Title and artist are required' });
    }

    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.coverImage?.[0];
    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    // Upload audio (treat as 'video' for audio formats) and cover image
    const audioUp = await uploadBufferToCloudinary(audioFile.buffer, { resource_type: 'video' });
    let imageUp;
    if (imageFile) {
      imageUp = await uploadBufferToCloudinary(imageFile.buffer, { resource_type: 'image' });
    }

    const newSong = await Song.create({
      title,
      artist,
      description,
      audioUrl: audioUp.secure_url,
      audioPublicId: audioUp.public_id,
      ...(imageUp
        ? { coverImageUrl: imageUp.secure_url, coverImagePublicId: imageUp.public_id }
        : {}),
    });

    res.status(201).json(newSong);
  } catch (error) {
    console.error('Create song error:', error);
    next(error);
  }
};

const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    console.error('Get all songs error:', error);
    next(error);
  }
};

const getSingleSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const { title, artist, description } = req.body;
    const update = {
      title: title ?? song.title,
      artist: artist ?? song.artist,
      description: description ?? song.description,
    };

    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.coverImage?.[0];

    // If new audio uploaded
    if (audioFile) {
      const audioUp = await uploadBufferToCloudinary(audioFile.buffer, { resource_type: 'video' });
      update.audioUrl = audioUp.secure_url;
      update.audioPublicId = audioUp.public_id;

      // delete old audio if present
      if (song.audioPublicId) {
        try {
          await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: 'video' });
        } catch (e) {
          console.warn('Could not delete old audio:', e.message);
        }
      }
    }

    // If new cover image uploaded
    if (imageFile) {
      const imageUp = await uploadBufferToCloudinary(imageFile.buffer, { resource_type: 'image' });
      update.coverImageUrl = imageUp.secure_url;
      update.coverImagePublicId = imageUp.public_id;

      if (song.coverImagePublicId) {
        try {
          await cloudinary.uploader.destroy(song.coverImagePublicId, { resource_type: 'image' });
        } catch (e) {
          console.warn('Could not delete old cover image:', e.message);
        }
      }
    }

    const updated = await Song.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Error updating song:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // delete cloudinary assets if present
    if (song.audioPublicId) {
      try {
        await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: 'video' });
      } catch (e) {
        console.warn('Could not delete song audio:', e.message);
      }
    }
    if (song.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(song.coverImagePublicId, { resource_type: 'image' });
      } catch (e) {
        console.warn('Could not delete song cover image:', e.message);
      }
    }

    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSong,
  getAllSongs,
  getSingleSong,
  deleteSong,
  updateSong,
};
