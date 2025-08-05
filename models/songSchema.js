const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    description: { type: String },

    // Cloudinary fields
    audioUrl: { type: String },            // https CDN URL
    audioPublicId: { type: String },       // for delete/replace

    coverImageUrl: { type: String },       // https CDN URL
    coverImagePublicId: { type: String },  // for delete/replace

    releaseDate: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },

    comments: [
      {
        _id: false,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
