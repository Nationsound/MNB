const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controllers.js');
const upload = require('../multer.js');

// Create new song with file uploads
router.post(
  '/mnb/api/createSong',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  songController.createSong
);

// Get all songs
router.get('/mnb/api/getAllSongs', songController.getAllSongs);

// Get single song by ID
router.get('/mnb/api/getSingleSong/:id', songController.getSingleSong);

// Update song by ID (allow replacing audio and/or cover image)
router.put(
  '/mnb/api/updateSong/:id',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  songController.updateSong
);

// Delete song by ID
router.delete('/mnb/api/deleteSong/:id', songController.deleteSong);

module.exports = router;
