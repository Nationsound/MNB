// multer.js
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (tune as needed)
  },
  fileFilter: (req, file, cb) => {
    // accept common audio and image mimetypes
    const isAudio = /^audio\//.test(file.mimetype);
    const isImage = /^image\//.test(file.mimetype);
    if (isAudio || isImage) return cb(null, true);
    cb(new Error('Only audio and image files are allowed'));
  },
});

module.exports = upload;
