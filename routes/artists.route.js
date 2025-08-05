const express = require('express');
const router = express.Router();
const upload = require('../multer');
const artistController = require('../controllers/artistControllers');

// Create new artist
router.post('/mnb/api/addArtist', upload.single('image'), artistController.createArtist);

// Get all artists
router.get('/mnb/api/getAllArtist', artistController.getAllArtists);

// Delete artist by ID
router.delete('/mnb/api/deleteArtist/:id', artistController.deleteArtist);

// Update artist by ID (with optional new image)
router.put('/mnb/api/updateArtist/:id', upload.single('image'), artistController.updateArtist);

module.exports = router;
