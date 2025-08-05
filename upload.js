// upload.js (root)
const express = require("express");
const streamifier = require("streamifier");
const cloudinary = require("./utils/cloudinary"); // make sure this path/file exists
const upload = require("./multer");               // <-- reuse the shared Multer instance

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const folder = process.env.CLOUDINARY_FOLDER || "uploads";

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" }, // auto handles image/audio/video/pdf
        (err, out) => (err ? reject(err) : resolve(out))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
