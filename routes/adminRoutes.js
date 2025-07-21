const express = require('express');
const adminControllers = require('../controllers/adminControllers');
const router = express.Router();
const upload = require('../upload');

// Create admin with image upload
router.post('/mnb/api/admins', upload.single('image'), adminControllers.createAdmin);

// Get all admins
router.get('/mnb/api/admins', adminControllers.getAdmins);

// Update admin by ID (allow update with new image)
router.put('/mnb/api/admins/:id', upload.single('image'), adminControllers.updateAdmin);

// Delete admin by ID
router.delete('/mnb/api/admins/:id', adminControllers.deleteAdmin);

// Admin login
router.post('/mnb/api/admins-login', adminControllers.adminLogin);

module.exports = router; 
