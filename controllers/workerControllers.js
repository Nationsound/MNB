const Worker = require('../models/workerSchema');
const { nanoid } = require('nanoid');
const cloudinary = require('../utils/cloudinary'); // your cloudinary config

// Create Worker
const createWorker = async (req, res) => {
  try {

    let photoUrl = '';

    if (req.file) {
      console.log("Uploading to Cloudinary...");

      const uploadResult = await cloudinary.uploader.upload_stream(
        {
          folder: 'mnb/workers',
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Photo upload failed", error: error.message });
          }
          photoUrl = result.secure_url;
        }
      );

      // Convert buffer to stream
      const streamifier = require('streamifier');
      streamifier.createReadStream(req.file.buffer).pipe(uploadResult);
    }

    const workerData = {
      name: req.body.name,
      role: req.body.role,
      idNumber: nanoid(8),
      photo: photoUrl,
    };

    const newWorker = new Worker(workerData);
    await newWorker.save();

    return res.status(201).json({
      message: 'Worker created successfully',
      worker: newWorker,
    });

  } catch (error) {
    console.error('Create worker error (full):', error);
    return res.status(500).json({
      message: 'Failed to create worker',
      error: error.message,
    });
  }
};

// Update Worker
const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    let photoUrl = worker.photo;

    if (req.file) {
      console.log("Uploading to Cloudinary...");

      // Convert buffer to stream upload
      const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'mnb/workers' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(fileBuffer);
        });
      };

      const uploadResult = await uploadFromBuffer(req.file.buffer);
      photoUrl = uploadResult.secure_url;
    }

    worker.name = req.body.name || worker.name;
    worker.role = req.body.role || worker.role;
    worker.photo = photoUrl;

    await worker.save();

    res.status(200).json({ message: 'Worker updated successfully', worker });
  } catch (error) {
    console.error('Update worker error:', error);
    res.status(500).json({ message: 'Failed to update worker', error: error.message });
  }
};


// Get Workers
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Worker
const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    res.status(200).json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createWorker, getWorkers, updateWorker, deleteWorker };
