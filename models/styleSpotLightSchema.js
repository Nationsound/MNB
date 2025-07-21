const mongoose = require('mongoose');

const styleSpotlightSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Male', 'Female'],
      required: true
    },
    image: {
      type: String,  // stored as path (e.g., /uploads/filename.jpg)
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const StyleSpotlight = mongoose.model('StyleSpotlight', styleSpotlightSchema);
module.exports = StyleSpotlight;
