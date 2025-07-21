const express = require('express');
const partnershipController = require('../controllers/partnershipControllers'); 
const router = express.Router();

// POST new partnership
router.post('/mnb/api/partnership', partnershipController.createPartnership);

// GET all partnerships
router.get('/mnb/api/partnerships', partnershipController.getAllPartnerships);

// GET single partnership by ID
router.get('/mnb/api/partnership/:id', partnershipController.getPartnership);

// PUT update partnership by ID
router.put('/mnb/api/partnership/:id', partnershipController.updatePartnership);

// DELETE partnership by ID
router.delete('/mnb/api/partnership/:id', partnershipController.deletePartnership);

module.exports = router;
