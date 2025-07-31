const express = require('express');
const contactController= require('../controllers/contactControllers');

const router = express.Router();

// POST /mnb/api/contacts
router.post('/mnb/api/contacts', contactController.createContact);

// (Optional) GET /mnb/api/contacts
router.get('/mnb/api/contacts', contactController.getContacts);

module.exports = router;
