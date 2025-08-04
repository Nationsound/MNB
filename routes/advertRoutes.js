const express = require('express');
const router = express.Router();
const advertController = require('../controllers/advertControllers');
const upload = require('../upload');

// Create advert
router.post('/mnb/api/adverts', upload.single('image'), advertController.createAdvert);

// Get all adverts
router.get('/mnb/api/getAdverts', advertController.getAdverts);

// Get single advert
router.get('/mnb/api/getAdvert/:id',advertController.getAdvertById);

// Update advert
router.put('/mnb/api/updateAdvert/:id', upload.single('image'), advertController.updateAdvert);

// Delete advert
router.delete('/mnb/api/deleteAdvert/:id', advertController.deleteAdvert);

module.exports = router;
