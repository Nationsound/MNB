const express = require('express');
const multer = require('multer');
const styleSpotLightControllers = require('../controllers/styleSpotLightControllers');
const router = express.Router();
// configure multer to save uploads in /uploads/
const upload = multer({ dest: 'uploads/' });


router.get('/mnb/api/getAllSpotlights', styleSpotLightControllers.getAllSpotlights);
router.post('/mnb/api/spotlights', upload.single('image'), styleSpotLightControllers.addSpotlight);

module.exports = router;
