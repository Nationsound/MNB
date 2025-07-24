const Song = require('../models/songSchema');


const createSong = async (req, res, next) => {
  try {
    const { title, artist, description } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ message: 'Title and artist are required' });
    }

    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.coverImage?.[0]; // ✅ must match field name

    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const newSong = new Song({
      title,
      artist,
      description,
      audioUrl: `https://app.mynationblog.fun/uploads/${audioFile.filename}`, // ✅ full public URL
      coverImage: imageFile 
        ? `https://app.mynationblog.fun/uploads/${imageFile.filename}` 
        : null,
    });

    const savedSong = await newSong.save();
    res.status(201).json(savedSong);

  } catch (error) {
    console.error('Create song error:', error);
    next(error);
  }
};



const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find();

    const updatedSongs = songs.map(song => {
      // convert to plain object
      const songObj = song.toObject();
      return {
        ...songObj,
        audioUrl: songObj.audioUrl.startsWith('http')
          ? songObj.audioUrl
          : `https://app.mynationblog.fun/${songObj.audioUrl}`,
        coverImage: songObj.coverImage?.startsWith('http')
          ? songObj.coverImage
          : songObj.coverImage ? `https://app.mynationblog.fun/${songObj.coverImage}` : null
      };
    });

    res.json(updatedSongs);
  } catch (error) {
    console.error('Get all songs error:', error);
    next(error);
  }
};


const getSingleSong = async (req, res) =>{
    try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ message: 'Server error' });
  }

};

const updateSong = async (req, res) => {
    try {
    const { title, artist, description } = req.body;

    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      { title, artist, description },
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' }); 
    }

    res.json(updatedSong);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ message: 'Server error' });
  }

};

const deleteSong = async (req, res) => {
    try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports ={
    createSong,
    getAllSongs,
    getSingleSong,
    deleteSong,
    updateSong,
}