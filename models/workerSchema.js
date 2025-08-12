const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  idNumber: { type: String, unique: true },
  photo: { type: String } // optional
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
