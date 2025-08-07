const mongoose = require('mongoose');
const slugify = require('slugify'); // install this via npm

const SmartLinkSchema = new mongoose.Schema({
  songTitle: { type: String, required: true },
  artistName: { type: String, required: true },
  coverImageUrl: { type: String },
  coverImagePublicId: { type: String },
  audioFile: { type: String },

  // 🎵 Platform links (add these)
  youtube: { type: String },
  spotify: { type: String },
  appleMusic: { type: String },
  audiomack: { type: String },
  boomplay: { type: String },

  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});


// Auto-generate slug before saving
SmartLinkSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(`${this.songTitle}-${this.artistName}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

module.exports = mongoose.model('SmartLink', SmartLinkSchema);
