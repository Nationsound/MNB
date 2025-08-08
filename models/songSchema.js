const mongoose = require('mongoose');
const slugify = require('slugify');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, trim: true }, // For SEO-friendly URLs
    artist: { type: String, required: true, trim: true },

    // Optional album field
    albumName: { type: String, trim: true },

    // Fixed set of genres for consistency
    genre: {
      type: String,
      required: true,
      enum: [
        "Afrobeats",
        "Hip-Hop",
        "Pop",
        "R&B",
        "Jazz",
        "Gospel",
        "Classical",
        "Rock",
        "Electronic"
      ]
    },

    description: { type: String, trim: true },

    // Cloudinary fields for audio
    audioUrl: { type: String, required: true },
    audioPublicId: { type: String, required: true },

    // Cloudinary fields for cover image
    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },

    releaseDate: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },

    comments: [
      {
        _id: false,
        username: { type: String, trim: true, default: "Anonymous" },
        text: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate slug from title + artist before save
songSchema.pre('save', function (next) {
  if (!this.isModified('title') && this.slug) return next();
  this.slug = slugify(`${this.title} ${this.artist}`, { lower: true, strict: true });
  next();
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
