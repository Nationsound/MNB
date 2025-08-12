const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controllers.js');
const upload = require('../multer.js');

function ensureSlugParam(req, res, next) {
  if (!req.params.slug || typeof req.params.slug !== 'string') {
    return res.status(400).json({ message: 'slug is required' });
  }
  next();
}

// Create
router.post(
  '/mnb/api/createSong',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }, 
  ]),
  songController.createSong
);

// Get all (with optional ?page=&limit=)
router.get('/mnb/api/getAllSongs', songController.getAllSongs);

// Get single song by slug
router.get('/mnb/api/getSongBySlug/:slug', ensureSlugParam, songController.getSongBySlug);

// Optional convenience shorter route
router.get('/mnb/api/songs/:slug', ensureSlugParam, songController.getSongBySlug);

// Update song by slug
router.put(
  '/mnb/api/updateSong/:slug',
  ensureSlugParam,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  songController.updateSong
);

// Delete song by slug
router.delete('/mnb/api/deleteSong/:slug', ensureSlugParam, songController.deleteSong);

module.exports = router;
