const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  fileUrl: {
    type: String, // store the path if you handle file uploads
  },
  dateTime: {
    type: Date, // store the selected date & time
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
