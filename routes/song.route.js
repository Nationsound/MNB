const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controllers.js');
const upload = require('../upload'); // adjust path if needed

// Create new song with file uploads
router.post(
  '/mnb/api/createSong',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }   // was 'image', should be 'coverImage'
  ]),
  songController.createSong
);

// Get all songs
router.get('/mnb/api/getAllSongs', songController.getAllSongs);

// Get single song by ID
router.get('/mnb/api/getSingleSong/:id', songController.getSingleSong);

// Update song by ID
router.put('/mnb/api/updateSong/:id', songController.updateSong);

// Delete song by ID
router.delete('/mnb/api/deleteSong/:id', songController.deleteSong);

module.exports = router;
