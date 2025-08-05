const express = require('express');
const upload = require('../multer'); // memoryStorage for Cloudinary
const styleSpotlightControllers = require('../controllers/styleSpotLightControllers');

const router = express.Router();

// GET all spotlights
router.get('/mnb/api/getAllSpotlights', styleSpotlightControllers.getAllSpotlights);

// POST new spotlight
router.post('/mnb/api/spotlights', upload.single('image'), styleSpotlightControllers.addSpotlight);

// PUT (update) spotlight by ID
router.put('/mnb/api/spotlights/:id', upload.single('image'), styleSpotlightControllers.updateSpotlight);

// DELETE spotlight by ID
router.delete('/mnb/api/spotlights/:id', styleSpotlightControllers.deleteSpotlight);

module.exports = router;
