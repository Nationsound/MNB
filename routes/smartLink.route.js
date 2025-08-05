const express = require('express');
const router = express.Router();
const upload = require('../multer.js');

const { createSmartLink, getSmartLinkById } = require('../controllers/smartLink.controllers.js');

router.post('/mnb/api/smart-link', upload.single('coverImage'), createSmartLink);
router.get('/mnb/api/getSmartLink/:id', getSmartLinkById);

module.exports = router;
