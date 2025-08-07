const express = require('express');
const router = express.Router();
const upload = require('../multer.js');

const { createSmartLink, getSmartLinkBySlug } = require('../controllers/smartLink.controllers.js');

// POST route to create a smart link (with image upload)
router.post('/mnb/api/smart-link', upload.single('coverImage'), createSmartLink);

// GET route to fetch smart link using slug instead of ID
router.get('/mnb/api/getSmartLink/:slug', getSmartLinkBySlug);

module.exports = router;
