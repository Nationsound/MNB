const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // e.g., audio-162387123.mp3 or image-162387123.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const field = file.fieldname; // will be 'audio' or 'image'
    cb(null, `${field}-${uniqueSuffix}${ext}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

module.exports = upload; 
