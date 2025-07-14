const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/admin.controllers.js');

// Route
router.post('/mnb/api/admin-login', adminLogin);

module.exports = router;
